import { randomUUID } from "crypto";
import type {
  ATSReport,
  JobPostingInput,
  SingleJobMatchSummary,
  MarketSkillConsensus,
  MultiJobAnalysisSummary,
} from "./types";
import { runATSAnalysis, type ATSAnalysisOptions } from "./engine";
import { createAtsDocumentIndex } from "./document-indexer";
import { ALIAS_TO_CANONICAL, simplifyAlias } from "./aliases";

/**
 * Runs ATS analysis across multiple job descriptions simultaneously.
 * Computes an aggregated Market Consensus Benchmark:
 * - Tests the resume against each job description concurrently.
 * - Identifies high-frequency core skills required across the market (>=50% of jobs).
 * - Identifies differentiator / bonus skills (<50% frequency).
 * - Computes individual per-job match scores and overall market fit.
 */
export async function runMultiJobATSAnalysis(
  rawResumeText: string,
  jobs: JobPostingInput[],
  options: ATSAnalysisOptions = {}
): Promise<{
  compositeReport: ATSReport;
  multiJobSummary: MultiJobAnalysisSummary;
}> {
  if (!jobs || jobs.length === 0) {
    throw new Error("At least one job description is required for ATS analysis.");
  }

  const analysisId = options.analysisId || randomUUID();
  const benchmarkTitle = options.jobTitle || jobs[0].title || "Target Role Benchmark";

  // 1. If only 1 job was provided, run standard single job analysis
  if (jobs.length === 1) {
    const singleReport = await runATSAnalysis(rawResumeText, jobs[0].description, {
      ...options,
      analysisId,
      jobTitle: jobs[0].title,
    });

    const singleJobSummary: MultiJobAnalysisSummary = {
      totalJobsAnalyzed: 1,
      averageScore: singleReport.overallScore,
      highestScore: singleReport.overallScore,
      lowestScore: singleReport.overallScore,
      strongMatchCount: singleReport.overallScore >= 80 ? 1 : 0,
      moderateMatchCount: singleReport.overallScore >= 60 && singleReport.overallScore < 80 ? 1 : 0,
      lowMatchCount: singleReport.overallScore < 60 ? 1 : 0,
      coreSkillsCount: singleReport.skills.matched.length + singleReport.skills.missing.length,
      matchedCoreSkillsCount: singleReport.skills.matched.length,
      consensusSkills: [
        ...singleReport.skills.matched.map((s) => ({
          skill: s.skill,
          frequency: 1,
          percentage: 100,
          isCore: true,
          matchedInResume: true,
          matchType: s.matchType,
        })),
        ...singleReport.skills.missing.map((s) => ({
          skill: s.skill,
          frequency: 1,
          percentage: 100,
          isCore: true,
          matchedInResume: false,
          matchType: "missing" as const,
        })),
      ],
      jobBreakdowns: [
        {
          jobId: jobs[0].id || "job-1",
          jobTitle: jobs[0].title || "Job Posting",
          company: jobs[0].company || "Target Employer",
          experienceLevel: jobs[0].experienceLevel,
          overallScore: singleReport.overallScore,
          keywordScore: singleReport.breakdown.keywordMatch,
          skillScore: singleReport.breakdown.skillMatch,
          matchedSkillsCount: singleReport.skills.matched.length,
          missingSkillsCount: singleReport.skills.missing.length,
          matchedSkills: singleReport.skills.matched.map((s) => s.skill),
          missingSkills: singleReport.skills.missing.map((s) => s.skill),
          status:
            singleReport.overallScore >= 80
              ? "strong_match"
              : singleReport.overallScore >= 60
              ? "moderate_match"
              : "low_match",
        },
      ],
      benchmarkTitle,
    };

    singleReport.multiJobSummary = singleJobSummary;
    return {
      compositeReport: singleReport,
      multiJobSummary: singleJobSummary,
    };
  }

  // 2. Multi-Job Analysis: Run analyses across all jobs concurrently
  const singleResults = await Promise.all(
    jobs.map(async (job, idx) => {
      const report = await runATSAnalysis(rawResumeText, job.description, {
        ...options,
        analysisId: `${analysisId}-sub-${idx}`,
        jobTitle: job.title,
      });
      return {
        job,
        report,
      };
    })
  );

  const resumeIndex = createAtsDocumentIndex(rawResumeText);

  // 3. Track skill frequencies across all job postings
  const skillOccurrences = new Map<string, { count: number; jobs: string[] }>();

  for (const { job, report } of singleResults) {
    const allSkillsInJob = new Set([
      ...report.skills.matched.map((s) => s.skill),
      ...report.skills.missing.map((s) => s.skill),
      ...report.skills.preferred.map((s) => s.skill),
    ]);

    for (const skill of allSkillsInJob) {
      const canonical = ALIAS_TO_CANONICAL.get(simplifyAlias(skill)) || skill;
      const existing = skillOccurrences.get(canonical) || { count: 0, jobs: [] };
      existing.count += 1;
      existing.jobs.push(job.title);
      skillOccurrences.set(canonical, existing);
    }
  }

  // 4. Compute Consensus Market Skills
  const consensusSkills: MarketSkillConsensus[] = [];

  for (const [skill, data] of skillOccurrences.entries()) {
    const percentage = Math.round((data.count / jobs.length) * 100);
    // Core skill if required by >= 50% of postings, or >= 2 postings when small set
    const isCore = jobs.length <= 2 ? data.count >= 2 : percentage >= 50;

    const termMatch = resumeIndex.matchTerm(skill);
    const matchedInResume = termMatch.matched;

    consensusSkills.push({
      skill,
      frequency: data.count,
      percentage,
      isCore,
      matchedInResume,
      matchType: termMatch.matchType,
    });
  }

  // Sort: core first, then by frequency descending
  consensusSkills.sort((a, b) => {
    if (a.isCore && !b.isCore) return -1;
    if (!a.isCore && b.isCore) return 1;
    return b.frequency - a.frequency;
  });

  // 5. Per-job breakdown cards
  const jobBreakdowns: SingleJobMatchSummary[] = singleResults.map(({ job, report }, idx) => {
    const status: SingleJobMatchSummary["status"] =
      report.overallScore >= 80
        ? "strong_match"
        : report.overallScore >= 60
        ? "moderate_match"
        : "low_match";

    return {
      jobId: job.id || `job-${idx + 1}`,
      jobTitle: job.title || `Job Posting #${idx + 1}`,
      company: job.company || `Company #${idx + 1}`,
      experienceLevel: job.experienceLevel,
      overallScore: report.overallScore,
      keywordScore: report.breakdown.keywordMatch,
      skillScore: report.breakdown.skillMatch,
      matchedSkillsCount: report.skills.matched.length,
      missingSkillsCount: report.skills.missing.length,
      matchedSkills: report.skills.matched.map((s) => s.skill),
      missingSkills: report.skills.missing.map((s) => s.skill),
      status,
    };
  });

  // 6. Aggregate multi-job market metrics
  const totalScores = singleResults.map((r) => r.report.overallScore);
  const averageScore = Math.round(totalScores.reduce((a, b) => a + b, 0) / totalScores.length);
  const highestScore = Math.max(...totalScores);
  const lowestScore = Math.min(...totalScores);

  const strongMatchCount = jobBreakdowns.filter((b) => b.status === "strong_match").length;
  const moderateMatchCount = jobBreakdowns.filter((b) => b.status === "moderate_match").length;
  const lowMatchCount = jobBreakdowns.filter((b) => b.status === "low_match").length;

  const coreSkills = consensusSkills.filter((s) => s.isCore);
  const matchedCoreSkillsCount = coreSkills.filter((s) => s.matchedInResume).length;

  const multiJobSummary: MultiJobAnalysisSummary = {
    totalJobsAnalyzed: jobs.length,
    averageScore,
    highestScore,
    lowestScore,
    strongMatchCount,
    moderateMatchCount,
    lowMatchCount,
    coreSkillsCount: coreSkills.length,
    matchedCoreSkillsCount,
    consensusSkills,
    jobBreakdowns,
    benchmarkTitle,
  };

  // 7. Synthesize Composite Master Job Description & Report
  // Use the highest-scoring or representative single report as baseline and augment with multi-job metrics
  const bestSingle = singleResults.reduce((best, curr) =>
    curr.report.overallScore > best.report.overallScore ? curr : best
  );

  const compositeReport: ATSReport = {
    ...bestSingle.report,
    analysisId,
    overallScore: averageScore, // Overall score is the market average across all job descriptions
    methodologyNotice: `Multi-Job Market Benchmark: Tested against ${jobs.length} diverse job descriptions for "${benchmarkTitle}". Scores reflect industry consensus and real-world keyword frequencies.`,
    breakdown: {
      keywordMatch: Math.round(
        singleResults.reduce((acc, r) => acc + r.report.breakdown.keywordMatch, 0) / jobs.length
      ),
      semanticSimilarity: Math.round(
        singleResults.reduce((acc, r) => acc + r.report.breakdown.semanticSimilarity, 0) / jobs.length
      ),
      skillMatch: Math.round(
        (matchedCoreSkillsCount / Math.max(coreSkills.length, 1)) * 100
      ),
      experienceMatch: Math.round(
        singleResults.reduce((acc, r) => acc + r.report.breakdown.experienceMatch, 0) / jobs.length
      ),
      formatting: bestSingle.report.formatting.score,
    },
    // Missing keywords ordered by market frequency
    missingKeywords: consensusSkills
      .filter((s) => !s.matchedInResume)
      .slice(0, 15)
      .map((s) => ({
        keyword: s.skill,
        status: "missing" as const,
        matchType: "missing" as const,
        importance: s.isCore ? ("high" as const) : ("medium" as const),
      })),
    matchedKeywords: consensusSkills
      .filter((s) => s.matchedInResume)
      .map((s) => ({
        keyword: s.skill,
        status: "matched" as const,
        matchType: "exact" as const,
        importance: s.isCore ? ("high" as const) : ("medium" as const),
      })),
    multiJobSummary,
    job: {
      title: `${benchmarkTitle} (${jobs.length} Job Postings Benchmark)`,
      experienceYears: Math.round(
        singleResults
          .map((r) => r.report.job.experienceYears || 0)
          .filter(Boolean)
          .reduce((a, b, _, arr) => a + b / arr.length, 0)
      ) || undefined,
      requiredSkillsCount: coreSkills.length,
      preferredSkillsCount: consensusSkills.filter((s) => !s.isCore).length,
    },
  };

  return {
    compositeReport,
    multiJobSummary,
  };
}
