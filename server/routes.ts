import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertClubSchema, insertMembershipSchema, insertAnnouncementSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Set up authentication routes
  setupAuth(app);

  // Club routes
  app.get("/api/clubs", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      let clubs;
      if (search) {
        clubs = await storage.searchClubs(search as string);
      } else if (category) {
        clubs = await storage.getClubsByCategory(category as string);
      } else {
        clubs = await storage.getClubs();
      }
      
      // Add user-specific data if authenticated
      if (req.isAuthenticated()) {
        const userId = req.user!.id;
        for (const club of clubs) {
          const membership = await storage.getMembership(userId, club.id);
          club.isMember = !!membership;
          club.userRole = membership?.role;
        }
      }
      
      res.json(clubs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clubs" });
    }
  });

  app.get("/api/clubs/:id", async (req, res) => {
    try {
      const club = await storage.getClub(req.params.id);
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
      
      const memberCount = (await storage.getClubMemberships(club.id)).length;
      const leader = club.leaderId ? await storage.getUser(club.leaderId) : undefined;
      
      let isMember = false;
      let userRole = undefined;
      if (req.isAuthenticated()) {
        const membership = await storage.getMembership(req.user!.id, club.id);
        isMember = !!membership;
        userRole = membership?.role;
      }
      
      res.json({
        ...club,
        memberCount,
        leader,
        isMember,
        userRole
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch club" });
    }
  });

  app.post("/api/clubs", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const user = req.user!;
    if (user.role !== "leader" && user.role !== "admin") {
      return res.status(403).json({ message: "Only leaders and admins can create clubs" });
    }
    
    try {
      const clubData = insertClubSchema.parse(req.body);
      const club = await storage.createClub({
        ...clubData,
        leaderId: user.id
      });
      
      // Add leader as member with leader role
      await storage.createMembership({
        userId: user.id,
        clubId: club.id,
        role: "leader"
      });
      
      res.status(201).json(club);
    } catch (error) {
      res.status(400).json({ message: "Invalid club data" });
    }
  });

  app.put("/api/clubs/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const club = await storage.getClub(req.params.id);
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
      
      const user = req.user!;
      const membership = await storage.getMembership(user.id, club.id);
      
      if (user.role !== "admin" && (club.leaderId !== user.id && membership?.role !== "leader")) {
        return res.status(403).json({ message: "Only club leaders and admins can edit clubs" });
      }
      
      const updates = insertClubSchema.partial().parse(req.body);
      const updatedClub = await storage.updateClub(req.params.id, updates);
      
      res.json(updatedClub);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  // Membership routes
  app.post("/api/clubs/:clubId/join", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const club = await storage.getClub(req.params.clubId);
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
      
      const userId = req.user!.id;
      const existingMembership = await storage.getMembership(userId, req.params.clubId);
      
      if (existingMembership) {
        return res.status(400).json({ message: "Already a member of this club" });
      }
      
      const membership = await storage.createMembership({
        userId,
        clubId: req.params.clubId,
        role: "member"
      });
      
      res.status(201).json(membership);
    } catch (error) {
      res.status(500).json({ message: "Failed to join club" });
    }
  });

  app.delete("/api/clubs/:clubId/leave", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const userId = req.user!.id;
      const success = await storage.deleteMembership(userId, req.params.clubId);
      
      if (!success) {
        return res.status(404).json({ message: "Membership not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to leave club" });
    }
  });

  app.get("/api/clubs/:clubId/members", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const club = await storage.getClub(req.params.clubId);
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
      
      const user = req.user!;
      const membership = await storage.getMembership(user.id, req.params.clubId);
      
      // Only club leaders and admins can view member list
      if (user.role !== "admin" && (club.leaderId !== user.id && membership?.role !== "leader")) {
        return res.status(403).json({ message: "Only club leaders and admins can view members" });
      }
      
      const members = await storage.getClubMemberships(req.params.clubId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch members" });
    }
  });

  // User membership routes
  app.get("/api/user/memberships", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const memberships = await storage.getUserMemberships(req.user!.id);
      res.json(memberships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch memberships" });
    }
  });

  // Announcement routes
  app.get("/api/announcements", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const announcements = await storage.getUserAnnouncements(req.user!.id);
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });

  app.get("/api/clubs/:clubId/announcements", async (req, res) => {
    try {
      const announcements = await storage.getClubAnnouncements(req.params.clubId);
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch club announcements" });
    }
  });

  app.post("/api/clubs/:clubId/announcements", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const club = await storage.getClub(req.params.clubId);
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
      
      const user = req.user!;
      const membership = await storage.getMembership(user.id, req.params.clubId);
      
      if (user.role !== "admin" && (club.leaderId !== user.id && membership?.role !== "leader")) {
        return res.status(403).json({ message: "Only club leaders and admins can create announcements" });
      }
      
      const announcementData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement({
        ...announcementData,
        clubId: req.params.clubId,
        authorId: user.id
      });
      
      res.status(201).json(announcement);
    } catch (error) {
      res.status(400).json({ message: "Invalid announcement data" });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    if (req.user!.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    try {
      const totalStudents = Array.from(storage['users'].values()).filter(u => u.role === "student").length;
      const totalLeaders = Array.from(storage['users'].values()).filter(u => u.role === "leader").length;
      const activeClubs = Array.from(storage['clubs'].values()).filter(c => c.isActive).length;
      const totalMemberships = Array.from(storage['memberships'].values()).length;
      
      res.json({
        totalStudents,
        totalLeaders,
        activeClubs,
        totalMemberships
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
