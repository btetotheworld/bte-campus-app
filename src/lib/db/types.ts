// AUTO-GENERATED. Do not hand-edit.
// Generated 2026-09-04T21:08:56.293Z by scripts/generate-db-types.mjs
// Regenerate with: pnpm run db:types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type application_status =
  | "draft"
  | "submitted"
  | "under_review"
  | "interview"
  | "offered"
  | "conditional"
  | "declined"
  | "withdrawn"
  | "lapsed";
export type approach_outcome = "live" | "declined" | "accepted" | "lapsed";
export type badge_kind = "called" | "filled" | "skilled";
export type build_log_kind = "shipped" | "learned" | "stuck";
export type chapter_status =
  "approved" | "active" | "at_risk" | "dormant" | "closed";
export type department_kind = "team" | "campus_chapter";
export type escalation_category =
  | "money"
  | "press"
  | "fellowship"
  | "safety"
  | "name_use"
  | "signature"
  | "chapter_slipping";
export type meeting_format = "ninety" | "sixty";
export type meeting_status = "scheduled" | "held" | "cancelled";
export type member_status = "member" | "observer";
export type membership_role =
  | "founder"
  | "coordinator"
  | "campus_lead"
  | "assistant_lead"
  | "practitioner"
  | "member";
export type person_status = "pending" | "verified" | "hidden" | "inactive";
export type reliability_result = "pass" | "concern" | "fail";
export type shift_delivery = "full" | "shortened" | "missed";
export type submission_status =
  "submitted" | "in_review" | "reviewed" | "expo_offered";

export type Database = {
  public: {
    Tables: {
      application_scores: {
        Row: {
          id: string;
          application_id: string;
          reviewer_id: string;
          score_groundwork: number;
          score_track_record: number;
          score_written: number;
          score_video: number;
          score_pair: number;
          score_availability: number;
          score_technical: number;
          weighted_total: number | null;
          red_flags: string | null;
          decision: string | null;
          scored_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          reviewer_id: string;
          score_groundwork: number;
          score_track_record: number;
          score_written: number;
          score_video: number;
          score_pair: number;
          score_availability: number;
          score_technical: number;
          weighted_total?: number | null;
          red_flags?: string | null;
          decision?: string | null;
          scored_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          reviewer_id?: string;
          score_groundwork?: number;
          score_track_record?: number;
          score_written?: number;
          score_video?: number;
          score_pair?: number;
          score_availability?: number;
          score_technical?: number;
          weighted_total?: number | null;
          red_flags?: string | null;
          decision?: string | null;
          scored_at?: string;
        };
        Relationships: [];
      };
      applications: {
        Row: {
          id: string;
          cohort_id: string;
          institution_id: string;
          lead_person_id: string;
          assistant_person_id: string | null;
          track_record: string | null;
          video_url: string | null;
          answer_problem: string | null;
          answer_faith_method: string | null;
          answer_failure: string | null;
          availability_note: string | null;
          status: application_status;
          submitted_at: string | null;
          conditional_deadline: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          cohort_id: string;
          institution_id: string;
          lead_person_id: string;
          assistant_person_id?: string | null;
          track_record?: string | null;
          video_url?: string | null;
          answer_problem?: string | null;
          answer_faith_method?: string | null;
          answer_failure?: string | null;
          availability_note?: string | null;
          status?: application_status;
          submitted_at?: string | null;
          conditional_deadline?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          cohort_id?: string;
          institution_id?: string;
          lead_person_id?: string;
          assistant_person_id?: string | null;
          track_record?: string | null;
          video_url?: string | null;
          answer_problem?: string | null;
          answer_faith_method?: string | null;
          answer_failure?: string | null;
          availability_note?: string | null;
          status?: application_status;
          submitted_at?: string | null;
          conditional_deadline?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      badges: {
        Row: {
          id: string;
          person_id: string;
          badge: badge_kind;
          awarded_at: string;
        };
        Insert: {
          id?: string;
          person_id: string;
          badge: badge_kind;
          awarded_at?: string;
        };
        Update: {
          id?: string;
          person_id?: string;
          badge?: badge_kind;
          awarded_at?: string;
        };
        Relationships: [];
      };
      build_logs: {
        Row: {
          id: string;
          chapter_id: string;
          person_id: string;
          term_id: string | null;
          kind: build_log_kind;
          body: string;
          posted_at: string;
        };
        Insert: {
          id?: string;
          chapter_id: string;
          person_id: string;
          term_id?: string | null;
          kind: build_log_kind;
          body: string;
          posted_at?: string;
        };
        Update: {
          id?: string;
          chapter_id?: string;
          person_id?: string;
          term_id?: string | null;
          kind?: build_log_kind;
          body?: string;
          posted_at?: string;
        };
        Relationships: [];
      };
      campus_chapters: {
        Row: {
          id: string;
          department_id: string;
          institution_id: string;
          fellowship_id: string | null;
          cohort_id: string | null;
          lead_person_id: string | null;
          assistant_person_id: string | null;
          status: chapter_status;
          launched_at: string | null;
          closed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          department_id: string;
          institution_id: string;
          fellowship_id?: string | null;
          cohort_id?: string | null;
          lead_person_id?: string | null;
          assistant_person_id?: string | null;
          status?: chapter_status;
          launched_at?: string | null;
          closed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          department_id?: string;
          institution_id?: string;
          fellowship_id?: string | null;
          cohort_id?: string | null;
          lead_person_id?: string | null;
          assistant_person_id?: string | null;
          status?: chapter_status;
          launched_at?: string | null;
          closed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      chapter_approvals: {
        Row: {
          id: string;
          chapter_id: string;
          gate1_people: boolean;
          gate2_selection: boolean;
          gate3_fellowship: boolean;
          gate4_venue: boolean;
          gate5_commitment: boolean;
          gate6_onboarding: boolean;
          gate8_letter: boolean;
          gate7_systems: boolean;
          gate1_confirmed_at: string | null;
          gate1_confirmed_by: string | null;
          gate2_confirmed_at: string | null;
          gate2_confirmed_by: string | null;
          gate3_confirmed_at: string | null;
          gate3_confirmed_by: string | null;
          gate4_confirmed_at: string | null;
          gate4_confirmed_by: string | null;
          gate5_confirmed_at: string | null;
          gate5_confirmed_by: string | null;
          gate6_confirmed_at: string | null;
          gate6_confirmed_by: string | null;
          gate7_confirmed_at: string | null;
          gate7_confirmed_by: string | null;
          gate8_confirmed_at: string | null;
          gate8_confirmed_by: string | null;
          gate1_evidence: string | null;
          gate2_evidence: string | null;
          gate3_evidence: string | null;
          gate4_evidence: string | null;
          gate5_evidence: string | null;
          gate6_evidence: string | null;
          gate7_evidence: string | null;
          gate8_evidence: string | null;
          conditional: boolean;
          conditional_deadline: string | null;
          outcome: string | null;
          decided_at: string | null;
          coordinator_id: string | null;
          countersigned_by: string | null;
          all_gates_clear: boolean | null;
        };
        Insert: {
          id?: string;
          chapter_id: string;
          gate1_people?: boolean;
          gate2_selection?: boolean;
          gate3_fellowship?: boolean;
          gate4_venue?: boolean;
          gate5_commitment?: boolean;
          gate6_onboarding?: boolean;
          gate8_letter?: boolean;
          gate7_systems?: boolean;
          gate1_confirmed_at?: string | null;
          gate1_confirmed_by?: string | null;
          gate2_confirmed_at?: string | null;
          gate2_confirmed_by?: string | null;
          gate3_confirmed_at?: string | null;
          gate3_confirmed_by?: string | null;
          gate4_confirmed_at?: string | null;
          gate4_confirmed_by?: string | null;
          gate5_confirmed_at?: string | null;
          gate5_confirmed_by?: string | null;
          gate6_confirmed_at?: string | null;
          gate6_confirmed_by?: string | null;
          gate7_confirmed_at?: string | null;
          gate7_confirmed_by?: string | null;
          gate8_confirmed_at?: string | null;
          gate8_confirmed_by?: string | null;
          gate1_evidence?: string | null;
          gate2_evidence?: string | null;
          gate3_evidence?: string | null;
          gate4_evidence?: string | null;
          gate5_evidence?: string | null;
          gate6_evidence?: string | null;
          gate7_evidence?: string | null;
          gate8_evidence?: string | null;
          conditional?: boolean;
          conditional_deadline?: string | null;
          outcome?: string | null;
          decided_at?: string | null;
          coordinator_id?: string | null;
          countersigned_by?: string | null;
          all_gates_clear?: boolean | null;
        };
        Update: {
          id?: string;
          chapter_id?: string;
          gate1_people?: boolean;
          gate2_selection?: boolean;
          gate3_fellowship?: boolean;
          gate4_venue?: boolean;
          gate5_commitment?: boolean;
          gate6_onboarding?: boolean;
          gate8_letter?: boolean;
          gate7_systems?: boolean;
          gate1_confirmed_at?: string | null;
          gate1_confirmed_by?: string | null;
          gate2_confirmed_at?: string | null;
          gate2_confirmed_by?: string | null;
          gate3_confirmed_at?: string | null;
          gate3_confirmed_by?: string | null;
          gate4_confirmed_at?: string | null;
          gate4_confirmed_by?: string | null;
          gate5_confirmed_at?: string | null;
          gate5_confirmed_by?: string | null;
          gate6_confirmed_at?: string | null;
          gate6_confirmed_by?: string | null;
          gate7_confirmed_at?: string | null;
          gate7_confirmed_by?: string | null;
          gate8_confirmed_at?: string | null;
          gate8_confirmed_by?: string | null;
          gate1_evidence?: string | null;
          gate2_evidence?: string | null;
          gate3_evidence?: string | null;
          gate4_evidence?: string | null;
          gate5_evidence?: string | null;
          gate6_evidence?: string | null;
          gate7_evidence?: string | null;
          gate8_evidence?: string | null;
          conditional?: boolean;
          conditional_deadline?: string | null;
          outcome?: string | null;
          decided_at?: string | null;
          coordinator_id?: string | null;
          countersigned_by?: string | null;
          all_gates_clear?: boolean | null;
        };
        Relationships: [];
      };
      chapter_members: {
        Row: {
          id: string;
          chapter_id: string;
          person_id: string;
          status: member_status;
          joined_at: string;
          status_changed_at: string | null;
        };
        Insert: {
          id?: string;
          chapter_id: string;
          person_id: string;
          status?: member_status;
          joined_at?: string;
          status_changed_at?: string | null;
        };
        Update: {
          id?: string;
          chapter_id?: string;
          person_id?: string;
          status?: member_status;
          joined_at?: string;
          status_changed_at?: string | null;
        };
        Relationships: [];
      };
      cohorts: {
        Row: {
          id: string;
          name: string;
          academic_year: string;
          applications_open_at: string | null;
          applications_close_at: string | null;
          interviews_from: string | null;
          interviews_to: string | null;
          outcomes_at: string | null;
          onboarding_call_at: string | null;
          chapters_cap: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          academic_year: string;
          applications_open_at?: string | null;
          applications_close_at?: string | null;
          interviews_from?: string | null;
          interviews_to?: string | null;
          outcomes_at?: string | null;
          onboarding_call_at?: string | null;
          chapters_cap?: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          academic_year?: string;
          applications_open_at?: string | null;
          applications_close_at?: string | null;
          interviews_from?: string | null;
          interviews_to?: string | null;
          outcomes_at?: string | null;
          onboarding_call_at?: string | null;
          chapters_cap?: number;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      departments: {
        Row: {
          id: string;
          name: string;
          kind: department_kind;
          parent_id: string | null;
          created_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          kind: department_kind;
          parent_id?: string | null;
          created_at?: string;
          archived_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          kind?: department_kind;
          parent_id?: string | null;
          created_at?: string;
          archived_at?: string | null;
        };
        Relationships: [];
      };
      escalations: {
        Row: {
          id: string;
          chapter_id: string | null;
          raised_by: string | null;
          category: escalation_category;
          body: string;
          raised_at: string;
          acknowledged_at: string | null;
          resolved_at: string | null;
          escalated_to_founder_at: string | null;
        };
        Insert: {
          id?: string;
          chapter_id?: string | null;
          raised_by?: string | null;
          category: escalation_category;
          body: string;
          raised_at?: string;
          acknowledged_at?: string | null;
          resolved_at?: string | null;
          escalated_to_founder_at?: string | null;
        };
        Update: {
          id?: string;
          chapter_id?: string | null;
          raised_by?: string | null;
          category?: escalation_category;
          body?: string;
          raised_at?: string;
          acknowledged_at?: string | null;
          resolved_at?: string | null;
          escalated_to_founder_at?: string | null;
        };
        Relationships: [];
      };
      fellowship_approaches: {
        Row: {
          id: string;
          fellowship_id: string;
          institution_id: string;
          opened_by: string;
          opened_at: string;
          window_closes_at: string;
          outcome: approach_outcome;
          closed_at: string | null;
        };
        Insert: {
          id?: string;
          fellowship_id: string;
          institution_id: string;
          opened_by: string;
          opened_at?: string;
          window_closes_at: string;
          outcome?: approach_outcome;
          closed_at?: string | null;
        };
        Update: {
          id?: string;
          fellowship_id?: string;
          institution_id?: string;
          opened_by?: string;
          opened_at?: string;
          window_closes_at?: string;
          outcome?: approach_outcome;
          closed_at?: string | null;
        };
        Relationships: [];
      };
      fellowship_scorecards: {
        Row: {
          id: string;
          application_id: string;
          fellowship_id: string;
          ask_description: string | null;
          asked_on: string | null;
          replied_on: string | null;
          did_reply: boolean | null;
          did_show: boolean | null;
          was_done: boolean | null;
          delegation: string | null;
          reliability_result: reliability_result | null;
          score_media_unit: number | null;
          score_venue: number | null;
          score_open_meeting: number | null;
          score_size: number | null;
          evidence_media_unit: string | null;
          evidence_venue: string | null;
          evidence_open_meeting: string | null;
          evidence_size: string | null;
          venue_permanent: boolean | null;
          venue_power: boolean | null;
          venue_capacity: number | null;
          venue_safe_access: boolean | null;
          venue_seen: boolean | null;
          proposed_day_time: string | null;
          applicant_attends: boolean | null;
          applicant_role: string | null;
          close_relation_leads: boolean | null;
          recommendation: string | null;
          submitted_at: string | null;
        };
        Insert: {
          id?: string;
          application_id: string;
          fellowship_id: string;
          ask_description?: string | null;
          asked_on?: string | null;
          replied_on?: string | null;
          did_reply?: boolean | null;
          did_show?: boolean | null;
          was_done?: boolean | null;
          delegation?: string | null;
          reliability_result?: reliability_result | null;
          score_media_unit?: number | null;
          score_venue?: number | null;
          score_open_meeting?: number | null;
          score_size?: number | null;
          evidence_media_unit?: string | null;
          evidence_venue?: string | null;
          evidence_open_meeting?: string | null;
          evidence_size?: string | null;
          venue_permanent?: boolean | null;
          venue_power?: boolean | null;
          venue_capacity?: number | null;
          venue_safe_access?: boolean | null;
          venue_seen?: boolean | null;
          proposed_day_time?: string | null;
          applicant_attends?: boolean | null;
          applicant_role?: string | null;
          close_relation_leads?: boolean | null;
          recommendation?: string | null;
          submitted_at?: string | null;
        };
        Update: {
          id?: string;
          application_id?: string;
          fellowship_id?: string;
          ask_description?: string | null;
          asked_on?: string | null;
          replied_on?: string | null;
          did_reply?: boolean | null;
          did_show?: boolean | null;
          was_done?: boolean | null;
          delegation?: string | null;
          reliability_result?: reliability_result | null;
          score_media_unit?: number | null;
          score_venue?: number | null;
          score_open_meeting?: number | null;
          score_size?: number | null;
          evidence_media_unit?: string | null;
          evidence_venue?: string | null;
          evidence_open_meeting?: string | null;
          evidence_size?: string | null;
          venue_permanent?: boolean | null;
          venue_power?: boolean | null;
          venue_capacity?: number | null;
          venue_safe_access?: boolean | null;
          venue_seen?: boolean | null;
          proposed_day_time?: string | null;
          applicant_attends?: boolean | null;
          applicant_role?: string | null;
          close_relation_leads?: boolean | null;
          recommendation?: string | null;
          submitted_at?: string | null;
        };
        Relationships: [];
      };
      fellowships: {
        Row: {
          id: string;
          institution_id: string;
          name: string;
          leader_name: string | null;
          leader_role: string | null;
          contact_phone: string | null;
          contact_email: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          institution_id: string;
          name: string;
          leader_name?: string | null;
          leader_role?: string | null;
          contact_phone?: string | null;
          contact_email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          institution_id?: string;
          name?: string;
          leader_name?: string | null;
          leader_role?: string | null;
          contact_phone?: string | null;
          contact_email?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      institutions: {
        Row: {
          id: string;
          name: string;
          city: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          city?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          city?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      interviews: {
        Row: {
          id: string;
          application_id: string;
          interviewer_id: string;
          held_at: string | null;
          score_groundwork_holds: number | null;
          score_assistant_real: number | null;
          score_holds_room: number | null;
          score_escalates: number | null;
          score_works_in_system: number | null;
          score_honest: number | null;
          total: number | null;
          concern_note: string | null;
          recommendation: string | null;
          scored_at: string | null;
        };
        Insert: {
          id?: string;
          application_id: string;
          interviewer_id: string;
          held_at?: string | null;
          score_groundwork_holds?: number | null;
          score_assistant_real?: number | null;
          score_holds_room?: number | null;
          score_escalates?: number | null;
          score_works_in_system?: number | null;
          score_honest?: number | null;
          total?: number | null;
          concern_note?: string | null;
          recommendation?: string | null;
          scored_at?: string | null;
        };
        Update: {
          id?: string;
          application_id?: string;
          interviewer_id?: string;
          held_at?: string | null;
          score_groundwork_holds?: number | null;
          score_assistant_real?: number | null;
          score_holds_room?: number | null;
          score_escalates?: number | null;
          score_works_in_system?: number | null;
          score_honest?: number | null;
          total?: number | null;
          concern_note?: string | null;
          recommendation?: string | null;
          scored_at?: string | null;
        };
        Relationships: [];
      };
      meeting_reports: {
        Row: {
          id: string;
          meeting_id: string;
          filed_by: string;
          filed_at: string;
          attendance_total: number;
          first_timers: number;
          practitioner_block: string;
          practitioner_person_id: string | null;
          demonstrators: string;
          blocked: string;
          submissions_noted: string;
          shift_ran: shift_delivery;
          shift_reason: string | null;
          shift_feedback: string | null;
          shift_pack_version: string | null;
          coordinator_flags: string | null;
          flags_read_at: string | null;
          flags_read_by: string | null;
        };
        Insert: {
          id?: string;
          meeting_id: string;
          filed_by: string;
          filed_at?: string;
          attendance_total: number;
          first_timers?: number;
          practitioner_block: string;
          practitioner_person_id?: string | null;
          demonstrators: string;
          blocked: string;
          submissions_noted: string;
          shift_ran: shift_delivery;
          shift_reason?: string | null;
          shift_feedback?: string | null;
          shift_pack_version?: string | null;
          coordinator_flags?: string | null;
          flags_read_at?: string | null;
          flags_read_by?: string | null;
        };
        Update: {
          id?: string;
          meeting_id?: string;
          filed_by?: string;
          filed_at?: string;
          attendance_total?: number;
          first_timers?: number;
          practitioner_block?: string;
          practitioner_person_id?: string | null;
          demonstrators?: string;
          blocked?: string;
          submissions_noted?: string;
          shift_ran?: shift_delivery;
          shift_reason?: string | null;
          shift_feedback?: string | null;
          shift_pack_version?: string | null;
          coordinator_flags?: string | null;
          flags_read_at?: string | null;
          flags_read_by?: string | null;
        };
        Relationships: [];
      };
      meetings: {
        Row: {
          id: string;
          chapter_id: string;
          term_id: string;
          meeting_number: number;
          scheduled_for: string;
          format: meeting_format;
          status: meeting_status;
        };
        Insert: {
          id?: string;
          chapter_id: string;
          term_id: string;
          meeting_number: number;
          scheduled_for: string;
          format?: meeting_format;
          status?: meeting_status;
        };
        Update: {
          id?: string;
          chapter_id?: string;
          term_id?: string;
          meeting_number?: number;
          scheduled_for?: string;
          format?: meeting_format;
          status?: meeting_status;
        };
        Relationships: [];
      };
      memberships: {
        Row: {
          id: string;
          person_id: string;
          department_id: string;
          role: membership_role;
          started_at: string;
          ended_at: string | null;
        };
        Insert: {
          id?: string;
          person_id: string;
          department_id: string;
          role: membership_role;
          started_at?: string;
          ended_at?: string | null;
        };
        Update: {
          id?: string;
          person_id?: string;
          department_id?: string;
          role?: membership_role;
          started_at?: string;
          ended_at?: string | null;
        };
        Relationships: [];
      };
      open_meeting_confirmations: {
        Row: {
          id: string;
          chapter_id: string;
          fellowship_id: string;
          host_signatory_name: string;
          host_signatory_role: string | null;
          signed_at: string;
          academic_year: string;
          document_url: string | null;
        };
        Insert: {
          id?: string;
          chapter_id: string;
          fellowship_id: string;
          host_signatory_name: string;
          host_signatory_role?: string | null;
          signed_at: string;
          academic_year: string;
          document_url?: string | null;
        };
        Update: {
          id?: string;
          chapter_id?: string;
          fellowship_id?: string;
          host_signatory_name?: string;
          host_signatory_role?: string | null;
          signed_at?: string;
          academic_year?: string;
          document_url?: string | null;
        };
        Relationships: [];
      };
      people: {
        Row: {
          id: string;
          auth_user_id: string | null;
          full_name: string;
          email: string;
          phone: string | null;
          status: person_status;
          graduation_year: number | null;
          year_group: number | null;
          created_at: string;
          verified_at: string | null;
        };
        Insert: {
          id?: string;
          auth_user_id?: string | null;
          full_name: string;
          email: string;
          phone?: string | null;
          status?: person_status;
          graduation_year?: number | null;
          year_group?: number | null;
          created_at?: string;
          verified_at?: string | null;
        };
        Update: {
          id?: string;
          auth_user_id?: string | null;
          full_name?: string;
          email?: string;
          phone?: string | null;
          status?: person_status;
          graduation_year?: number | null;
          year_group?: number | null;
          created_at?: string;
          verified_at?: string | null;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          submission_id: string;
          reviewer_id: string | null;
          due_at: string;
          body: string | null;
          outcome: string | null;
          returned_at: string | null;
        };
        Insert: {
          id?: string;
          submission_id: string;
          reviewer_id?: string | null;
          due_at: string;
          body?: string | null;
          outcome?: string | null;
          returned_at?: string | null;
        };
        Update: {
          id?: string;
          submission_id?: string;
          reviewer_id?: string | null;
          due_at?: string;
          body?: string | null;
          outcome?: string | null;
          returned_at?: string | null;
        };
        Relationships: [];
      };
      shift_packs: {
        Row: {
          id: string;
          term_number: number;
          session_number: number;
          title: string;
          anchor_reference: string;
          version: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          term_number: number;
          session_number: number;
          title: string;
          anchor_reference: string;
          version: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          term_number?: number;
          session_number?: number;
          title?: string;
          anchor_reference?: string;
          version?: string;
          published_at?: string | null;
        };
        Relationships: [];
      };
      submissions: {
        Row: {
          id: string;
          chapter_id: string;
          person_id: string;
          title: string;
          description: string;
          links: string | null;
          media_urls: string | null;
          unfinished: string | null;
          status: submission_status;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          chapter_id: string;
          person_id: string;
          title: string;
          description: string;
          links?: string | null;
          media_urls?: string | null;
          unfinished?: string | null;
          status?: submission_status;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          chapter_id?: string;
          person_id?: string;
          title?: string;
          description?: string;
          links?: string | null;
          media_urls?: string | null;
          unfinished?: string | null;
          status?: submission_status;
          submitted_at?: string;
        };
        Relationships: [];
      };
      succession_records: {
        Row: {
          id: string;
          chapter_id: string;
          term_id: string | null;
          lead_person_id: string | null;
          assistant_person_id: string | null;
          lead_graduation_year: number | null;
          assistant_graduation_year: number | null;
          assistant_is_real: boolean | null;
          overlap_started_at: string | null;
          handover_completed_at: string | null;
          audited_at: string | null;
          audited_by: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          chapter_id: string;
          term_id?: string | null;
          lead_person_id?: string | null;
          assistant_person_id?: string | null;
          lead_graduation_year?: number | null;
          assistant_graduation_year?: number | null;
          assistant_is_real?: boolean | null;
          overlap_started_at?: string | null;
          handover_completed_at?: string | null;
          audited_at?: string | null;
          audited_by?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          chapter_id?: string;
          term_id?: string | null;
          lead_person_id?: string | null;
          assistant_person_id?: string | null;
          lead_graduation_year?: number | null;
          assistant_graduation_year?: number | null;
          assistant_is_real?: boolean | null;
          overlap_started_at?: string | null;
          handover_completed_at?: string | null;
          audited_at?: string | null;
          audited_by?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      terms: {
        Row: {
          id: string;
          chapter_id: string;
          academic_year: string;
          term_number: number;
          dates_published_at: string | null;
        };
        Insert: {
          id?: string;
          chapter_id: string;
          academic_year: string;
          term_number: number;
          dates_published_at?: string | null;
        };
        Update: {
          id?: string;
          chapter_id?: string;
          academic_year?: string;
          term_number?: number;
          dates_published_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      application_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "interview"
        | "offered"
        | "conditional"
        | "declined"
        | "withdrawn"
        | "lapsed";
      approach_outcome: "live" | "declined" | "accepted" | "lapsed";
      badge_kind: "called" | "filled" | "skilled";
      build_log_kind: "shipped" | "learned" | "stuck";
      chapter_status: "approved" | "active" | "at_risk" | "dormant" | "closed";
      department_kind: "team" | "campus_chapter";
      escalation_category:
        | "money"
        | "press"
        | "fellowship"
        | "safety"
        | "name_use"
        | "signature"
        | "chapter_slipping";
      meeting_format: "ninety" | "sixty";
      meeting_status: "scheduled" | "held" | "cancelled";
      member_status: "member" | "observer";
      membership_role:
        | "founder"
        | "coordinator"
        | "campus_lead"
        | "assistant_lead"
        | "practitioner"
        | "member";
      person_status: "pending" | "verified" | "hidden" | "inactive";
      reliability_result: "pass" | "concern" | "fail";
      shift_delivery: "full" | "shortened" | "missed";
      submission_status:
        "submitted" | "in_review" | "reviewed" | "expo_offered";
    };
    CompositeTypes: Record<string, never>;
  };
};
