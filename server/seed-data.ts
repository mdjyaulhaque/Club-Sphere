import { storage } from "./storage";

export async function seedMockData() {
  console.log("Seeding mock data...");

  // Create sample users with different roles
  const adminUser = await storage.createUser({
    username: "admin",
    email: "admin@school.clubsphere",
    fullName: "School Administrator",
    schoolId: "ADMIN001",
    role: "admin",
    password: "$hashed_password_admin" // In real app, this would be properly hashed
  });

  const leader1 = await storage.createUser({
    username: "mdleader",
    email: "md.jyaulh@school.clubsphere", 
    fullName: "Mike Johnson",
    schoolId: "STU001",
    role: "leader",
    password: "$hashed_password_leader1"
  });

  const leader2 = await storage.createUser({
    username: "letsupgrade",
    email: "letsupgrade@school.clubsphere",
    fullName: "Sarah Chen", 
    schoolId: "STU002",
    role: "leader",
    password: "$hashed_password_leader2"
  });

  const student1 = await storage.createUser({
    username: "ajaytudent",
    email: "alay.kumar@school.clubsphere",
    fullName: "Ajay Kumar",
    schoolId: "STU003", 
    role: "student",
    password: "$hashed_password_student1"
  });

  const student2 = await storage.createUser({
    username: "shashi208",
    email: "shashi028@school.clubsphere",
    fullName: "Shashi Singh",
    schoolId: "STU004",
    role: "student", 
    password: "$hashed_password_student2"
  });

  const student3 = await storage.createUser({
    username: "hasnainjh",
    email: "hasnainjh@school.clubsphere",
    fullName: "Md Hasnain",
    schoolId: "STU005",
    role: "student",
    password: "$hashed_password_student3"
  });

  // Create sample clubs across different categories
  const programmingClub = await storage.createClub({
    name: "Programming Club",
    description: "Learn coding, build projects, and participate in hackathons. Welcome to students of all skill levels!",
    category: "Technology",
    leaderId: leader1.id,
    meetingTime: "Fridays 4:00 PM",
    meetingLocation: "Computer Lab 201",
    isActive: true
  });

  const artSociety = await storage.createClub({
    name: "Art Society", 
    description: "Express your creativity through various art forms including painting, sculpture, and digital art.",
    category: "Arts",
    leaderId: leader2.id,
    meetingTime: "Wednesdays 3:30 PM", 
    meetingLocation: "Art Studio B",
    isActive: true
  });

  const debateClub = await storage.createClub({
    name: "Debate Club",
    description: "Develop public speaking skills and engage in thoughtful discussions on current events.",
    category: "Academic", 
    leaderId: leader1.id,
    meetingTime: "Tuesdays 4:15 PM",
    meetingLocation: "Room 105",
    isActive: true
  });

  const soccerTeam = await storage.createClub({
    name: "Soccer Team",
    description: "Competitive soccer team representing our school. Join us for practices and matches!",
    category: "Sports",
    leaderId: leader2.id,
    meetingTime: "Monday & Thursday 5:00 PM",
    meetingLocation: "Soccer Field",
    isActive: true
  });

  const volunteerClub = await storage.createClub({
    name: "Community Volunteers",
    description: "Make a difference in our community through service projects and volunteer work.",
    category: "Service",
    leaderId: leader1.id,
    meetingTime: "Saturdays 10:00 AM",
    meetingLocation: "Student Center",
    isActive: true
  });

  // Create memberships (leaders are automatically added when clubs are created)
  await storage.createMembership({
    userId: student1.id,
    clubId: programmingClub.id,
    role: "member"
  });

  await storage.createMembership({
    userId: student1.id,
    clubId: debateClub.id,
    role: "member"
  });

  await storage.createMembership({
    userId: student2.id,
    clubId: artSociety.id,
    role: "member"
  });

  await storage.createMembership({
    userId: student2.id,
    clubId: programmingClub.id,
    role: "member" 
  });

  await storage.createMembership({
    userId: student3.id,
    clubId: soccerTeam.id,
    role: "member"
  });

  await storage.createMembership({
    userId: student3.id,
    clubId: volunteerClub.id,
    role: "member"
  });

  // Make one student an officer in a club
  await storage.createMembership({
    userId: student1.id,
    clubId: volunteerClub.id,
    role: "officer"
  });

  // Create sample announcements
  await storage.createAnnouncement({
    title: "Hackathon Registration Open!",
    content: "Our annual hackathon is coming up next month. Registration is now open for all skill levels. Prizes include $500 gift cards and internship opportunities!",
    clubId: programmingClub.id,
    authorId: leader1.id
  });

  await storage.createAnnouncement({
    title: "Weekly Meeting Canceled",
    content: "This week's meeting is canceled due to the school holiday. We'll resume next week with our planned debate on climate policy.",
    clubId: debateClub.id,
    authorId: leader1.id
  });

  await storage.createAnnouncement({
    title: "Art Exhibition Next Friday",
    content: "Come display your artwork at our monthly exhibition! Setup starts at 2 PM in the main hallway. Refreshments will be provided.",
    clubId: artSociety.id,
    authorId: leader2.id
  });

  await storage.createAnnouncement({
    title: "Soccer Practice Schedule Update",
    content: "Due to field maintenance, Tuesday's practice is moved to Wednesday at 5 PM. Thursday practice remains the same.",
    clubId: soccerTeam.id,
    authorId: leader2.id
  });

  await storage.createAnnouncement({
    title: "Food Drive This Weekend", 
    content: "Join us for our monthly food drive at the local food bank. We meet at the student center at 10 AM. Volunteer hours will be provided!",
    clubId: volunteerClub.id,
    authorId: leader1.id
  });

  console.log("Mock data seeded successfully!");
  console.log(`Created ${await getDataCounts()}`);
}

async function getDataCounts() {
  const clubs = await storage.getClubs();
  const memberships = await storage.getUserMemberships(await getFirstUserId());
  
  return `5 users, ${clubs.length} clubs, and announcements`;
}

async function getFirstUserId() {
  // Helper to get any user ID for counting memberships
  const users = Array.from(storage['users'].values());
  return users[0]?.id || "";
}