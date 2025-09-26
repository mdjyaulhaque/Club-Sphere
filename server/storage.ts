import { type User, type InsertUser, type Club, type InsertClub, type Membership, type InsertMembership, type Announcement, type InsertAnnouncement, type ClubWithDetails, type AnnouncementWithDetails } from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Club methods
  getClub(id: string): Promise<Club | undefined>;
  getClubs(): Promise<ClubWithDetails[]>;
  getClubsByCategory(category: string): Promise<ClubWithDetails[]>;
  searchClubs(query: string): Promise<ClubWithDetails[]>;
  createClub(club: InsertClub): Promise<Club>;
  updateClub(id: string, updates: Partial<InsertClub>): Promise<Club | undefined>;
  deleteClub(id: string): Promise<boolean>;
  
  // Membership methods
  getMembership(userId: string, clubId: string): Promise<Membership | undefined>;
  getUserMemberships(userId: string): Promise<(Membership & { club: Club })[]>;
  getClubMemberships(clubId: string): Promise<(Membership & { user: User })[]>;
  createMembership(membership: InsertMembership): Promise<Membership>;
  deleteMembership(userId: string, clubId: string): Promise<boolean>;
  updateMembershipRole(userId: string, clubId: string, role: string): Promise<boolean>;
  
  // Announcement methods
  getAnnouncement(id: string): Promise<Announcement | undefined>;
  getClubAnnouncements(clubId: string): Promise<AnnouncementWithDetails[]>;
  getUserAnnouncements(userId: string): Promise<AnnouncementWithDetails[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: string, updates: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: string): Promise<boolean>;
  
  // Session store
  sessionStore: any;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private clubs: Map<string, Club>;
  private memberships: Map<string, Membership>;
  private announcements: Map<string, Announcement>;
  public sessionStore: any;

  constructor() {
    this.users = new Map();
    this.clubs = new Map();
    this.memberships = new Map();
    this.announcements = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "student",
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Club methods
  async getClub(id: string): Promise<Club | undefined> {
    return this.clubs.get(id);
  }

  async getClubs(): Promise<ClubWithDetails[]> {
    const clubs = Array.from(this.clubs.values()).filter(club => club.isActive);
    return this.enrichClubsWithDetails(clubs);
  }

  async getClubsByCategory(category: string): Promise<ClubWithDetails[]> {
    const clubs = Array.from(this.clubs.values()).filter(club => 
      club.isActive && club.category === category
    );
    return this.enrichClubsWithDetails(clubs);
  }

  async searchClubs(query: string): Promise<ClubWithDetails[]> {
    const lowercaseQuery = query.toLowerCase();
    const clubs = Array.from(this.clubs.values()).filter(club => 
      club.isActive && (
        club.name.toLowerCase().includes(lowercaseQuery) ||
        club.description.toLowerCase().includes(lowercaseQuery) ||
        club.category.toLowerCase().includes(lowercaseQuery)
      )
    );
    return this.enrichClubsWithDetails(clubs);
  }

  async createClub(insertClub: InsertClub): Promise<Club> {
    const id = randomUUID();
    const club: Club = { 
      ...insertClub, 
      id,
      leaderId: insertClub.leaderId || null,
      meetingTime: insertClub.meetingTime || null,
      meetingLocation: insertClub.meetingLocation || null,
      isActive: insertClub.isActive ?? true,
      createdAt: new Date()
    };
    this.clubs.set(id, club);
    return club;
  }

  async updateClub(id: string, updates: Partial<InsertClub>): Promise<Club | undefined> {
    const club = this.clubs.get(id);
    if (!club) return undefined;
    
    const updatedClub = { ...club, ...updates };
    this.clubs.set(id, updatedClub);
    return updatedClub;
  }

  async deleteClub(id: string): Promise<boolean> {
    const club = this.clubs.get(id);
    if (!club) return false;
    
    // Soft delete by marking as inactive
    club.isActive = false;
    this.clubs.set(id, club);
    return true;
  }

  // Membership methods
  async getMembership(userId: string, clubId: string): Promise<Membership | undefined> {
    return Array.from(this.memberships.values()).find(
      membership => membership.userId === userId && membership.clubId === clubId
    );
  }

  async getUserMemberships(userId: string): Promise<(Membership & { club: Club })[]> {
    const userMemberships = Array.from(this.memberships.values()).filter(
      membership => membership.userId === userId
    );
    
    return userMemberships.map(membership => {
      const club = this.clubs.get(membership.clubId)!;
      return { ...membership, club };
    }).filter(membership => membership.club.isActive);
  }

  async getClubMemberships(clubId: string): Promise<(Membership & { user: User })[]> {
    const clubMemberships = Array.from(this.memberships.values()).filter(
      membership => membership.clubId === clubId
    );
    
    return clubMemberships.map(membership => {
      const user = this.users.get(membership.userId)!;
      return { ...membership, user };
    });
  }

  async createMembership(insertMembership: InsertMembership): Promise<Membership> {
    const id = randomUUID();
    const membership: Membership = { 
      ...insertMembership, 
      id,
      role: insertMembership.role || "member",
      joinedAt: new Date()
    };
    this.memberships.set(id, membership);
    return membership;
  }

  async deleteMembership(userId: string, clubId: string): Promise<boolean> {
    const membership = Array.from(this.memberships.entries()).find(
      ([_, m]) => m.userId === userId && m.clubId === clubId
    );
    
    if (!membership) return false;
    
    this.memberships.delete(membership[0]);
    return true;
  }

  async updateMembershipRole(userId: string, clubId: string, role: string): Promise<boolean> {
    const membership = Array.from(this.memberships.values()).find(
      m => m.userId === userId && m.clubId === clubId
    );
    
    if (!membership) return false;
    
    membership.role = role;
    return true;
  }

  // Announcement methods
  async getAnnouncement(id: string): Promise<Announcement | undefined> {
    return this.announcements.get(id);
  }

  async getClubAnnouncements(clubId: string): Promise<AnnouncementWithDetails[]> {
    const announcements = Array.from(this.announcements.values()).filter(
      announcement => announcement.clubId === clubId
    );
    
    return this.enrichAnnouncementsWithDetails(announcements);
  }

  async getUserAnnouncements(userId: string): Promise<AnnouncementWithDetails[]> {
    // Get announcements from clubs the user is a member of
    const userMemberships = await this.getUserMemberships(userId);
    const clubIds = userMemberships.map(m => m.clubId);
    
    const announcements = Array.from(this.announcements.values()).filter(
      announcement => clubIds.includes(announcement.clubId)
    );
    
    return this.enrichAnnouncementsWithDetails(announcements);
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const id = randomUUID();
    const announcement: Announcement = { 
      ...insertAnnouncement, 
      id,
      createdAt: new Date()
    };
    this.announcements.set(id, announcement);
    return announcement;
  }

  async updateAnnouncement(id: string, updates: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const announcement = this.announcements.get(id);
    if (!announcement) return undefined;
    
    const updatedAnnouncement = { ...announcement, ...updates };
    this.announcements.set(id, updatedAnnouncement);
    return updatedAnnouncement;
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    return this.announcements.delete(id);
  }

  // Helper methods
  private async enrichClubsWithDetails(clubs: Club[]): Promise<ClubWithDetails[]> {
    return clubs.map(club => {
      const memberCount = Array.from(this.memberships.values()).filter(
        membership => membership.clubId === club.id
      ).length;
      
      const leader = club.leaderId ? this.users.get(club.leaderId) : undefined;
      
      return {
        ...club,
        memberCount,
        leader
      };
    });
  }

  private enrichAnnouncementsWithDetails(announcements: Announcement[]): AnnouncementWithDetails[] {
    return announcements.map(announcement => {
      const club = this.clubs.get(announcement.clubId)!;
      const author = this.users.get(announcement.authorId)!;
      
      return {
        ...announcement,
        club,
        author
      };
    }).sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }
}

export const storage = new MemStorage();
