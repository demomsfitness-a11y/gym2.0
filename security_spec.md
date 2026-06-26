# Security Specification - MS Fitness Firebase Rules

This document outlines the security architecture, invariants, attack-vector payloads ("Dirty Dozen"), and testing constraints for the MS Fitness application Firestore database.

## 1. Data Invariants

- **User Profiles (/users/{userId})**: Users can read and write only their own profiles. Only verified emails are allowed. Admins can read all profiles.
- **Membership Requests (/membershipRequests/{requestId})**: Users can create membership requests and view their own requests. Admins can read, update, and delete all requests. No user can approve their own request or edit fields like `status` once submitted.
- **Classes (/groupClasses/{classId})**: Classes are publicly readable, but only writeable/deletable by Admins.
- **Bookings (/bookings/{bookingId})**: Users can book, view, and cancel their own class bookings. Bookings must enforce identity integrity (`userId` matches the authenticated `request.auth.uid`).
- **Announcements (/announcements/{announcementId})**: Publicly readable, writeable only by Admins.
- **Trainers (/trainers/{trainerId})**: Publicly readable, writeable only by Admins.
- **Support Tickets (/supportTickets/{ticketId})**: Users can create, read, and reply to their own support tickets. Admins can read and update all tickets (for status, priority, and admin replies).
- **Contact Submissions (/contactSubmissions/{submissionId})**: Anyone can create. Only Admins can view, edit, or delete submissions.
- **Gallery (/gallery/{mediaId})**: Publicly readable, writeable only by Admins.
- **Website Content (/websiteContent/{contentId})**: Publicly readable, writeable only by Admins.

---

## 2. The "Dirty Dozen" Payloads (Exploit Testing)

Here are the 12 attack vectors designed to breach security, which the Firestore rules must strictly block with a `PERMISSION_DENIED` status.

1. **User Spoofing Profile Create**: User `attacker123` attempts to create a user profile under `/users/victim456`.
2. **User Admin Role Escalation**: User `user123` attempts to update their user document to set `role = "admin"` or set themselves as an Admin.
3. **Self-Approve Membership Request**: User `user123` creates a membership request and sets `status = "approved"` or updates their own pending request's `status` to `"active"`.
4. **Foreign Booking Deletion**: User `user123` attempts to delete a booking belonging to `victim456`.
5. **Class Capacity Manipulation**: Non-admin user attempts to create a group class with capacity set to `9999` to cause denial of service.
6. **Unauthorized Announcement Publication**: Non-admin user attempts to create a pinned announcement under `/announcements/fake-announcement`.
7. **Trainer Profile Manipulation**: Non-admin user attempts to delete a trainer profile.
8. **Eavesdropping on Support Tickets**: User `attacker123` tries to list all support tickets under `/supportTickets` without filter, or view ticket `/supportTickets/victimTicket`.
9. **Reading All Contact Responses**: Non-admin user attempts to list contact form submissions to scrape user contact details (PII leak).
10. **Website Theme/Content Vandalism**: Non-admin user attempts to write to `/websiteContent/homepage` to deface the homepage.
11. **Malicious ID Poisoning**: Attacker tries to write a document under `/users/` using an ID containing 1KB of special characters to cause system failures.
12. **Timestamp/Date Spoofing**: User sets `createdAt` to a future or past date instead of the server timestamp `request.time`.

---

## 3. Test Runner Design

The rules are validated programmatically to ensure all Dirty Dozen operations return `PERMISSION_DENIED` while authorized operations succeed. The global `isAdmin()` check verifies whether the current authenticated user's email matches the bootstrapped admin email `demo.msfitness@gmail.com` or has an entry in the `/admins` collection.

```typescript
// firestore.rules.test.ts (Conceptual representation)
// All tests assert:
// - Non-admin writes to public config collections fail.
// - PII fields can only be read by the owner or an admin.
// - Cross-user profile / booking updates fail.
// - All schema types, sizes, and server timestamp guards are strictly validated.
```
