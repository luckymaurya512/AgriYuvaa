/**
 * Profile Completion & Profile Strength Utility for AgriYuvaa
 * Calculates dynamic profile completion percentage (0 - 100%) and provides actionable checklist items.
 */

export const calculateProfileCompletion = (user, profile, formData = null) => {
  // Merge formData (in-progress edits) with persisted user/profile data
  const name = formData?.name !== undefined ? formData.name : user?.name;
  const phone = formData?.phone !== undefined ? formData.phone : user?.phone;
  const email = user?.email;
  const location = formData?.location !== undefined ? formData.location : profile?.location;
  
  const qualification = formData?.qualification !== undefined 
    ? formData.qualification 
    : (profile?.highestQualification || profile?.education?.[0]?.degree);

  const specialization = formData?.specialization !== undefined
    ? formData.specialization
    : (profile?.specialization || profile?.skills?.[0]);

  const experience = formData?.experienceLevel !== undefined
    ? formData.experienceLevel
    : (profile?.totalExperience || profile?.experience?.[0]?.title);

  const currentOrg = formData?.currentOrganization !== undefined
    ? formData.currentOrganization
    : (profile?.currentOrganization || profile?.experience?.[0]?.organization);

  const currentRole = formData?.currentDesignation !== undefined
    ? formData.currentDesignation
    : profile?.currentDesignation;

  const currentCtc = formData?.currentCtc !== undefined
    ? formData.currentCtc
    : profile?.currentCtc;

  const expectedCtc = formData?.expectedCtc !== undefined
    ? formData.expectedCtc
    : profile?.expectedCtc;

  const noticePeriod = formData?.noticePeriod !== undefined
    ? formData.noticePeriod
    : profile?.noticePeriod;

  const bio = formData?.bio !== undefined
    ? formData.bio
    : (profile?.bio || profile?.description || profile?.experience?.[0]?.description);

  const hasResume = Boolean(
    profile?.resumeUrl ||
    profile?.resumeFileData ||
    profile?.resumeData?.fullName
  );

  // 8 Specific Sections with clear weightage summing to 100%
  const criteria = [
    {
      id: "basic",
      label: "Full Name & Email",
      weight: 10,
      completed: Boolean(name?.trim() && email?.trim()),
      hint: "Add your full legal name",
    },
    {
      id: "contact",
      label: "Phone & City Location",
      weight: 10,
      completed: Boolean(phone?.trim() && location?.trim()),
      hint: "Add phone number and current city",
    },
    {
      id: "education",
      label: "Degree & Agri Specialization",
      weight: 15,
      completed: Boolean(qualification?.trim() && specialization?.trim()),
      hint: "Select your degree and agricultural discipline",
    },
    {
      id: "experience",
      label: "Experience Level",
      weight: 10,
      completed: Boolean(experience?.trim()),
      hint: "Specify your total years of experience or Fresher status",
    },
    {
      id: "employment",
      label: "Current Organization & Designation",
      weight: 15,
      completed: Boolean(currentOrg?.trim() || currentRole?.trim()),
      hint: "Add your current company, institute, or college",
    },
    {
      id: "ctc",
      label: "Current CTC & Expected CTC",
      weight: 15,
      completed: Boolean(currentCtc?.trim() && expectedCtc?.trim()),
      hint: "Specify your current & expected salary",
    },
    {
      id: "notice",
      label: "Notice Period & Availability",
      weight: 10,
      completed: Boolean(noticePeriod?.trim()),
      hint: "Specify your notice period / joining time",
    },
    {
      id: "resume",
      label: "Resume / Online CV",
      weight: 15,
      completed: hasResume,
      hint: "Upload a PDF resume or create one in Resume Builder",
    },
  ];

  const earnedScore = criteria.reduce((acc, c) => (c.completed ? acc + c.weight : acc), 0);
  const percentage = Math.min(100, Math.max(0, earnedScore));

  let statusLabel = "Getting Started";
  let statusColor = "amber";
  let badgeText = "Needs Details";

  if (percentage >= 100) {
    statusLabel = "All-Star Profile ⭐";
    statusColor = "emerald";
    badgeText = "100% Recruiter Ready";
  } else if (percentage >= 80) {
    statusLabel = "Very Strong";
    statusColor = "emerald";
    badgeText = "High Visibility";
  } else if (percentage >= 50) {
    statusLabel = "Good Progress";
    statusColor = "blue";
    badgeText = "Intermediate";
  }

  const pendingCriteria = criteria.filter((c) => !c.completed);
  const completedCriteria = criteria.filter((c) => c.completed);

  return {
    percentage,
    statusLabel,
    statusColor,
    badgeText,
    criteria,
    pendingCriteria,
    completedCriteria,
    isComplete: percentage >= 100,
  };
};
