/**
 * FHIR Learning Platform - Application Logic
 *
 * This module handles all interactive functionality:
 * - Dynamic section rendering
 * - Scrollspy navigation
 * - JSON viewer expand/collapse
 * - Copy-to-clipboard
 * - Mobile navigation
 * - Progress tracking
 * - Toast notifications
 */

(function () {
  "use strict";

  // =========================================
  // APPLICATION STATE
  // =========================================
  const AppState = {
    activeSection: null,
    sectionsRendered: false,
    expandedJsonViewers: new Set(),
    scrollspyObserver: null,
    mobileMenuOpen: false,
    filledForms: new Set(),
  };

  // =========================================
  // FORM FIELD DEFINITIONS
  // =========================================
  const FormFieldDefinitions = {
    appointment: {
      title: "Appointment Scheduling Form",
      fields: [
        {
          id: "resourceType",
          label: "Resource Type",
          type: "text",
          fhirPath: "resourceType",
          value: "Appointment",
        },
        {
          id: "status",
          label: "Appointment Status",
          type: "select",
          options: [
            "proposed",
            "pending",
            "booked",
            "arrived",
            "fulfilled",
            "cancelled",
            "noshow",
          ],
          fhirPath: "status",
          value: "fulfilled",
        },
        {
          id: "appointmentType",
          label: "Appointment Type",
          type: "text",
          fhirPath: "appointmentType.coding[0].display",
          value: "Routine appointment",
        },
        {
          id: "serviceType",
          label: "Service Type",
          type: "text",
          fhirPath: "serviceType[0].coding[0].display",
          value: "General Practice",
        },
        {
          id: "reasonText",
          label: "Reason for Visit",
          type: "text",
          fhirPath: "reasonCode[0].text",
          value: "Chest discomfort and shortness of breath",
        },
        {
          id: "description",
          label: "Description",
          type: "text",
          fhirPath: "description",
          value: "Initial consultation for chest symptoms",
        },
        {
          id: "startDateTime",
          label: "Start Date/Time",
          type: "datetime-local",
          fhirPath: "start",
          value: "2024-01-15T10:00",
        },
        {
          id: "endDateTime",
          label: "End Date/Time",
          type: "datetime-local",
          fhirPath: "end",
          value: "2024-01-15T10:30",
        },
        {
          id: "duration",
          label: "Duration (minutes)",
          type: "number",
          fhirPath: "minutesDuration",
          value: "30",
        },
        {
          id: "patientName",
          label: "Patient Name",
          type: "text",
          fhirPath: "participant[0].actor.display",
          value: "Maria Santos",
        },
        {
          id: "practitionerName",
          label: "Practitioner",
          type: "text",
          fhirPath: "participant[1].actor.display",
          value: "Dr. Sarah Chen",
        },
        {
          id: "locationName",
          label: "Location",
          type: "text",
          fhirPath: "participant[2].actor.display",
          value: "Examination Room 3",
        },
      ],
    },
    encounter: {
      title: "Patient Encounter Form",
      fields: [
        {
          id: "resourceType",
          label: "Resource Type",
          type: "text",
          fhirPath: "resourceType",
          value: "Encounter",
        },
        {
          id: "status",
          label: "Encounter Status",
          type: "select",
          options: [
            "planned",
            "arrived",
            "triaged",
            "in-progress",
            "onleave",
            "finished",
            "cancelled",
          ],
          fhirPath: "status",
          value: "finished",
        },
        {
          id: "class",
          label: "Encounter Class",
          type: "select",
          options: [
            "AMB (Ambulatory)",
            "EMER (Emergency)",
            "IMP (Inpatient)",
            "VR (Virtual)",
          ],
          fhirPath: "class.display",
          value: "AMB (Ambulatory)",
        },
        {
          id: "type",
          label: "Encounter Type",
          type: "text",
          fhirPath: "type[0].text",
          value: "Primary Care Consultation",
        },
        {
          id: "priority",
          label: "Priority",
          type: "text",
          fhirPath: "priority.coding[0].display",
          value: "Routine",
        },
        {
          id: "patientName",
          label: "Patient Name",
          type: "text",
          fhirPath: "subject.display",
          value: "Maria Santos",
        },
        {
          id: "practitionerName",
          label: "Attending Practitioner",
          type: "text",
          fhirPath: "participant[0].individual.display",
          value: "Dr. Sarah Chen, MD",
        },
        {
          id: "periodStart",
          label: "Visit Start",
          type: "datetime-local",
          fhirPath: "period.start",
          value: "2024-01-15T10:00",
        },
        {
          id: "periodEnd",
          label: "Visit End",
          type: "datetime-local",
          fhirPath: "period.end",
          value: "2024-01-15T11:45",
        },
        {
          id: "reasonText",
          label: "Reason for Visit",
          type: "text",
          fhirPath: "reasonCode[0].text",
          value: "Chest discomfort and shortness of breath",
        },
        {
          id: "locationName",
          label: "Service Location",
          type: "text",
          fhirPath: "location[0].location.display",
          value: "Examination Room 3",
        },
      ],
    },
    "service-request": {
      title: "Clinical Order Form",
      fields: [
        {
          id: "resourceType",
          label: "Resource Type",
          type: "text",
          fhirPath: "resourceType",
          value: "ServiceRequest",
        },
        {
          id: "status",
          label: "Order Status",
          type: "select",
          options: [
            "draft",
            "active",
            "on-hold",
            "completed",
            "revoked",
            "cancelled",
          ],
          fhirPath: "status",
          value: "completed",
        },
        {
          id: "intent",
          label: "Intent",
          type: "select",
          options: ["proposal", "plan", "directive", "order", "option"],
          fhirPath: "intent",
          value: "order",
        },
        {
          id: "priority",
          label: "Priority",
          type: "select",
          options: ["routine", "urgent", "asap", "stat"],
          fhirPath: "priority",
          value: "routine",
        },
        {
          id: "category",
          label: "Category",
          type: "text",
          fhirPath: "category[0].coding[0].display",
          value: "Laboratory procedure",
        },
        {
          id: "codeText",
          label: "Test/Procedure Name",
          type: "text",
          fhirPath: "code.text",
          value: "Comprehensive Lipid Panel",
        },
        {
          id: "codeSystem",
          label: "Code (LOINC)",
          type: "text",
          fhirPath: "code.coding[0].code",
          value: "57698-3",
        },
        {
          id: "patientName",
          label: "Patient Name",
          type: "text",
          fhirPath: "subject.display",
          value: "Maria Santos",
        },
        {
          id: "requesterName",
          label: "Ordering Provider",
          type: "text",
          fhirPath: "requester.display",
          value: "Dr. Sarah Chen, MD",
        },
        {
          id: "performerName",
          label: "Performing Lab",
          type: "text",
          fhirPath: "performer[0].display",
          value: "City General Hospital Laboratory",
        },
        {
          id: "authoredOn",
          label: "Order Date/Time",
          type: "datetime-local",
          fhirPath: "authoredOn",
          value: "2024-01-15T10:45",
        },
        {
          id: "reasonText",
          label: "Clinical Reason",
          type: "textarea",
          fhirPath: "reasonCode[0].text",
          value:
            "Evaluate cardiovascular risk for patient presenting with chest discomfort",
        },
      ],
    },
    observation: {
      title: "Clinical Observation Form",
      fields: [
        {
          id: "resourceType",
          label: "Resource Type",
          type: "text",
          fhirPath: "resourceType",
          value: "Observation",
        },
        {
          id: "status",
          label: "Observation Status",
          type: "select",
          options: [
            "registered",
            "preliminary",
            "final",
            "amended",
            "cancelled",
          ],
          fhirPath: "status",
          value: "final",
        },
        {
          id: "category",
          label: "Category",
          type: "text",
          fhirPath: "category[0].coding[0].display",
          value: "Vital Signs",
        },
        {
          id: "codeDisplay",
          label: "Observation Type",
          type: "text",
          fhirPath: "code.coding[0].display",
          value: "Blood pressure panel",
        },
        {
          id: "codeValue",
          label: "LOINC Code",
          type: "text",
          fhirPath: "code.coding[0].code",
          value: "85354-9",
        },
        {
          id: "patientName",
          label: "Patient Name",
          type: "text",
          fhirPath: "subject.display",
          value: "Maria Santos",
        },
        {
          id: "effectiveDateTime",
          label: "Measurement Date/Time",
          type: "datetime-local",
          fhirPath: "effectiveDateTime",
          value: "2024-01-15T10:05",
        },
        {
          id: "systolicValue",
          label: "Systolic BP (mmHg)",
          type: "number",
          fhirPath: "component[0].valueQuantity.value",
          value: "148",
        },
        {
          id: "diastolicValue",
          label: "Diastolic BP (mmHg)",
          type: "number",
          fhirPath: "component[1].valueQuantity.value",
          value: "92",
        },
        {
          id: "performerName",
          label: "Performed By",
          type: "text",
          fhirPath: "performer[0].display",
          value: "Nurse Johnson",
        },
        {
          id: "interpretation",
          label: "Interpretation",
          type: "text",
          fhirPath: "interpretation[0].text",
          value: "High - Stage 2 Hypertension",
        },
      ],
    },
    condition: {
      title: "Diagnosis/Condition Form",
      fields: [
        {
          id: "resourceType",
          label: "Resource Type",
          type: "text",
          fhirPath: "resourceType",
          value: "Condition",
        },
        {
          id: "clinicalStatus",
          label: "Clinical Status",
          type: "select",
          options: [
            "active",
            "recurrence",
            "relapse",
            "inactive",
            "remission",
            "resolved",
          ],
          fhirPath: "clinicalStatus.coding[0].code",
          value: "active",
        },
        {
          id: "verificationStatus",
          label: "Verification Status",
          type: "select",
          options: [
            "unconfirmed",
            "provisional",
            "differential",
            "confirmed",
            "refuted",
          ],
          fhirPath: "verificationStatus.coding[0].code",
          value: "confirmed",
        },
        {
          id: "category",
          label: "Category",
          type: "select",
          options: [
            "problem-list-item",
            "encounter-diagnosis",
            "health-concern",
          ],
          fhirPath: "category[0].coding[0].code",
          value: "encounter-diagnosis",
        },
        {
          id: "severity",
          label: "Severity",
          type: "select",
          options: ["mild", "moderate", "severe"],
          fhirPath: "severity.coding[0].display",
          value: "moderate",
        },
        {
          id: "codeDisplay",
          label: "Diagnosis Name",
          type: "text",
          fhirPath: "code.coding[0].display",
          value: "Essential hypertension",
        },
        {
          id: "codeValue",
          label: "SNOMED Code",
          type: "text",
          fhirPath: "code.coding[0].code",
          value: "59621000",
        },
        {
          id: "icd10Code",
          label: "ICD-10 Code",
          type: "text",
          fhirPath: "code.coding[1].code",
          value: "I10",
        },
        {
          id: "patientName",
          label: "Patient Name",
          type: "text",
          fhirPath: "subject.display",
          value: "Maria Santos",
        },
        {
          id: "onsetDateTime",
          label: "Onset Date",
          type: "date",
          fhirPath: "onsetDateTime",
          value: "2024-01-15",
        },
        {
          id: "recorderName",
          label: "Recorded By",
          type: "text",
          fhirPath: "recorder.display",
          value: "Dr. Sarah Chen, MD",
        },
      ],
    },
    allergy: {
      title: "Allergy/Intolerance Form",
      fields: [
        {
          id: "resourceType",
          label: "Resource Type",
          type: "text",
          fhirPath: "resourceType",
          value: "AllergyIntolerance",
        },
        {
          id: "clinicalStatus",
          label: "Clinical Status",
          type: "select",
          options: ["active", "inactive", "resolved"],
          fhirPath: "clinicalStatus.coding[0].code",
          value: "active",
        },
        {
          id: "verificationStatus",
          label: "Verification Status",
          type: "select",
          options: ["unconfirmed", "confirmed", "refuted", "entered-in-error"],
          fhirPath: "verificationStatus.coding[0].code",
          value: "confirmed",
        },
        {
          id: "type",
          label: "Type",
          type: "select",
          options: ["allergy", "intolerance"],
          fhirPath: "type",
          value: "allergy",
        },
        {
          id: "category",
          label: "Category",
          type: "select",
          options: ["food", "medication", "environment", "biologic"],
          fhirPath: "category[0]",
          value: "medication",
        },
        {
          id: "criticality",
          label: "Criticality",
          type: "select",
          options: ["low", "high", "unable-to-assess"],
          fhirPath: "criticality",
          value: "high",
        },
        {
          id: "codeDisplay",
          label: "Allergen",
          type: "text",
          fhirPath: "code.coding[0].display",
          value: "Penicillin",
        },
        {
          id: "codeValue",
          label: "RxNorm Code",
          type: "text",
          fhirPath: "code.coding[0].code",
          value: "7980",
        },
        {
          id: "patientName",
          label: "Patient Name",
          type: "text",
          fhirPath: "patient.display",
          value: "Maria Santos",
        },
        {
          id: "reactionManifestation",
          label: "Reaction",
          type: "text",
          fhirPath: "reaction[0].manifestation[0].coding[0].display",
          value: "Anaphylaxis",
        },
        {
          id: "reactionSeverity",
          label: "Reaction Severity",
          type: "select",
          options: ["mild", "moderate", "severe"],
          fhirPath: "reaction[0].severity",
          value: "severe",
        },
        {
          id: "recorderName",
          label: "Recorded By",
          type: "text",
          fhirPath: "recorder.display",
          value: "Dr. Sarah Chen, MD",
        },
      ],
    },
    medication: {
      title: "Medication Request Form",
      fields: [
        {
          id: "resourceType",
          label: "Resource Type",
          type: "text",
          fhirPath: "resourceType",
          value: "MedicationRequest",
        },
        {
          id: "status",
          label: "Status",
          type: "select",
          options: [
            "active",
            "on-hold",
            "cancelled",
            "completed",
            "stopped",
            "draft",
          ],
          fhirPath: "status",
          value: "active",
        },
        {
          id: "intent",
          label: "Intent",
          type: "select",
          options: [
            "proposal",
            "plan",
            "order",
            "original-order",
            "reflex-order",
            "filler-order",
            "instance-order",
          ],
          fhirPath: "intent",
          value: "order",
        },
        {
          id: "medicationDisplay",
          label: "Medication Name",
          type: "text",
          fhirPath: "medicationCodeableConcept.coding[0].display",
          value: "Lisinopril 10 MG Oral Tablet",
        },
        {
          id: "medicationCode",
          label: "RxNorm Code",
          type: "text",
          fhirPath: "medicationCodeableConcept.coding[0].code",
          value: "314076",
        },
        {
          id: "patientName",
          label: "Patient Name",
          type: "text",
          fhirPath: "subject.display",
          value: "Maria Santos",
        },
        {
          id: "prescriberName",
          label: "Prescriber",
          type: "text",
          fhirPath: "requester.display",
          value: "Dr. Sarah Chen, MD",
        },
        {
          id: "dosageInstruction",
          label: "Dosage Instructions",
          type: "text",
          fhirPath: "dosageInstruction[0].text",
          value: "Take 1 tablet by mouth once daily",
        },
        {
          id: "doseValue",
          label: "Dose Amount",
          type: "number",
          fhirPath: "dosageInstruction[0].doseAndRate[0].doseQuantity.value",
          value: "10",
        },
        {
          id: "doseUnit",
          label: "Dose Unit",
          type: "text",
          fhirPath: "dosageInstruction[0].doseAndRate[0].doseQuantity.unit",
          value: "mg",
        },
        {
          id: "frequency",
          label: "Frequency",
          type: "text",
          fhirPath: "dosageInstruction[0].timing.code.text",
          value: "Once daily",
        },
        {
          id: "dispenseQuantity",
          label: "Dispense Quantity",
          type: "number",
          fhirPath: "dispenseRequest.quantity.value",
          value: "30",
        },
        {
          id: "refills",
          label: "Number of Refills",
          type: "number",
          fhirPath: "dispenseRequest.numberOfRepeatsAllowed",
          value: "3",
        },
      ],
    },
    procedure: {
      title: "Procedure Documentation Form",
      fields: [
        {
          id: "resourceType",
          label: "Resource Type",
          type: "text",
          fhirPath: "resourceType",
          value: "Procedure",
        },
        {
          id: "status",
          label: "Status",
          type: "select",
          options: [
            "preparation",
            "in-progress",
            "not-done",
            "on-hold",
            "stopped",
            "completed",
          ],
          fhirPath: "status",
          value: "completed",
        },
        {
          id: "category",
          label: "Category",
          type: "text",
          fhirPath: "category.coding[0].display",
          value: "Diagnostic procedure",
        },
        {
          id: "codeDisplay",
          label: "Procedure Name",
          type: "text",
          fhirPath: "code.coding[0].display",
          value: "Electrocardiogram (ECG)",
        },
        {
          id: "codeValue",
          label: "SNOMED Code",
          type: "text",
          fhirPath: "code.coding[0].code",
          value: "29303009",
        },
        {
          id: "patientName",
          label: "Patient Name",
          type: "text",
          fhirPath: "subject.display",
          value: "Maria Santos",
        },
        {
          id: "performedStart",
          label: "Procedure Start",
          type: "datetime-local",
          fhirPath: "performedPeriod.start",
          value: "2024-01-15T10:15",
        },
        {
          id: "performedEnd",
          label: "Procedure End",
          type: "datetime-local",
          fhirPath: "performedPeriod.end",
          value: "2024-01-15T10:25",
        },
        {
          id: "performerName",
          label: "Performed By",
          type: "text",
          fhirPath: "performer[0].actor.display",
          value: "Nurse Johnson",
        },
        {
          id: "locationName",
          label: "Location",
          type: "text",
          fhirPath: "location.display",
          value: "ECG Suite, Cardiology Department",
        },
        {
          id: "outcome",
          label: "Outcome",
          type: "text",
          fhirPath: "outcome.text",
          value: "Normal sinus rhythm, no acute changes",
        },
        {
          id: "bodySite",
          label: "Body Site",
          type: "text",
          fhirPath: "bodySite[0].coding[0].display",
          value: "Heart structure",
        },
      ],
    },
    "diagnostic-report": {
      title: "Diagnostic Report Form",
      fields: [
        {
          id: "resourceType",
          label: "Resource Type",
          type: "text",
          fhirPath: "resourceType",
          value: "DiagnosticReport",
        },
        {
          id: "status",
          label: "Report Status",
          type: "select",
          options: [
            "registered",
            "partial",
            "preliminary",
            "final",
            "amended",
            "cancelled",
          ],
          fhirPath: "status",
          value: "final",
        },
        {
          id: "category",
          label: "Category",
          type: "text",
          fhirPath: "category[0].coding[0].display",
          value: "Laboratory",
        },
        {
          id: "codeDisplay",
          label: "Report Type",
          type: "text",
          fhirPath: "code.coding[0].display",
          value: "Lipid panel with direct LDL",
        },
        {
          id: "codeValue",
          label: "LOINC Code",
          type: "text",
          fhirPath: "code.coding[0].code",
          value: "57698-3",
        },
        {
          id: "patientName",
          label: "Patient Name",
          type: "text",
          fhirPath: "subject.display",
          value: "Maria Santos",
        },
        {
          id: "effectiveDateTime",
          label: "Collection Date/Time",
          type: "datetime-local",
          fhirPath: "effectiveDateTime",
          value: "2024-01-15T11:00",
        },
        {
          id: "issuedDateTime",
          label: "Report Issued",
          type: "datetime-local",
          fhirPath: "issued",
          value: "2024-01-15T11:30",
        },
        {
          id: "performerName",
          label: "Performing Lab",
          type: "text",
          fhirPath: "performer[0].display",
          value: "City General Hospital Laboratory",
        },
        {
          id: "conclusion",
          label: "Conclusion",
          type: "textarea",
          fhirPath: "conclusion",
          value:
            "Elevated total cholesterol and LDL cholesterol with low HDL. Findings consistent with hyperlipidemia. Recommend lifestyle modifications and consider statin therapy.",
        },
      ],
    },
    immunization: {
      title: "Immunization Record Form",
      fields: [
        {
          id: "resourceType",
          label: "Resource Type",
          type: "text",
          fhirPath: "resourceType",
          value: "Immunization",
        },
        {
          id: "status",
          label: "Status",
          type: "select",
          options: ["completed", "entered-in-error", "not-done"],
          fhirPath: "status",
          value: "completed",
        },
        {
          id: "vaccineDisplay",
          label: "Vaccine Name",
          type: "text",
          fhirPath: "vaccineCode.coding[0].display",
          value: "Influenza vaccine, injectable",
        },
        {
          id: "vaccineCode",
          label: "CVX Code",
          type: "text",
          fhirPath: "vaccineCode.coding[0].code",
          value: "141",
        },
        {
          id: "patientName",
          label: "Patient Name",
          type: "text",
          fhirPath: "patient.display",
          value: "Maria Santos",
        },
        {
          id: "occurrenceDateTime",
          label: "Administration Date",
          type: "datetime-local",
          fhirPath: "occurrenceDateTime",
          value: "2024-01-15T11:50",
        },
        {
          id: "performerName",
          label: "Administered By",
          type: "text",
          fhirPath: "performer[0].actor.display",
          value: "Nurse Johnson",
        },
        {
          id: "lotNumber",
          label: "Lot Number",
          type: "text",
          fhirPath: "lotNumber",
          value: "FL2024-789",
        },
        {
          id: "expirationDate",
          label: "Expiration Date",
          type: "date",
          fhirPath: "expirationDate",
          value: "2024-06-30",
        },
        {
          id: "site",
          label: "Administration Site",
          type: "text",
          fhirPath: "site.coding[0].display",
          value: "Left deltoid",
        },
        {
          id: "route",
          label: "Route",
          type: "text",
          fhirPath: "route.coding[0].display",
          value: "Intramuscular",
        },
        {
          id: "doseQuantity",
          label: "Dose (mL)",
          type: "number",
          fhirPath: "doseQuantity.value",
          value: "0.5",
        },
      ],
    },
    lifecycle: {
      title: "FHIR Resource Lifecycle",
      fields: [
        {
          id: "resourceType",
          label: "Resource Type",
          type: "text",
          fhirPath: "resourceType",
          value: "Bundle",
        },
        {
          id: "type",
          label: "Bundle Type",
          type: "select",
          options: [
            "document",
            "message",
            "transaction",
            "transaction-response",
            "batch",
            "batch-response",
            "history",
            "searchset",
            "collection",
          ],
          fhirPath: "type",
          value: "collection",
        },
        {
          id: "totalResources",
          label: "Total Resources",
          type: "number",
          fhirPath: "total",
          value: "11",
        },
        {
          id: "patientId",
          label: "Patient ID",
          type: "text",
          fhirPath: "entry[0].resource.id",
          value: "patient-maria-santos",
        },
        {
          id: "journeyStart",
          label: "Journey Start Date",
          type: "date",
          fhirPath: "timestamp",
          value: "2024-01-15",
        },
        {
          id: "totalEncounters",
          label: "Total Encounters",
          type: "number",
          fhirPath: "meta.tag[0].display",
          value: "1",
        },
        {
          id: "totalConditions",
          label: "Active Conditions",
          type: "number",
          fhirPath: "meta.tag[1].display",
          value: "2",
        },
        {
          id: "totalMedications",
          label: "Active Medications",
          type: "number",
          fhirPath: "meta.tag[2].display",
          value: "1",
        },
      ],
    },
  };

  // =========================================
  // DOM ELEMENTS
  // =========================================
  const DOM = {
    sectionsContainer: null,
    sidebar: null,
    sidebarOverlay: null,
    mobileMenuToggle: null,
    navLinks: null,
    progressFill: null,
    progressText: null,
    toastContainer: null,
  };

  // =========================================
  // INITIALIZATION
  // =========================================

  /**
   * Initialize the application when DOM is ready
   */
  function init() {
    // Initialize landing page
    initLandingPage();

    // Cache DOM elements
    cacheDOMElements();

    // Render content sections
    renderSections();

    // Initialize features
    initScrollspy();
    initSmoothScroll();
    initMobileMenu();
    initJsonViewers();
    initFormViewers();

    // Update progress on scroll
    window.addEventListener("scroll", throttle(updateProgress, 100));

    // Initial progress update
    updateProgress();

    console.log("🏥 FHIR Learning Platform initialized");
  }

  /**
   * Initialize landing page and handle navigation
   */
  function initLandingPage() {
    const landingPage = document.getElementById("landing-page");
    const clinicalFlow = document.getElementById("clinical-flow");
    const startJourneyBtn = document.getElementById("start-journey-btn");

    if (!landingPage || !clinicalFlow || !startJourneyBtn) {
      return;
    }

    startJourneyBtn.addEventListener("click", function () {
      // Fade out landing page
      landingPage.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      landingPage.style.opacity = "0";
      landingPage.style.transform = "scale(0.98)";

      setTimeout(function () {
        landingPage.style.display = "none";
        clinicalFlow.style.display = "block";
        clinicalFlow.style.opacity = "0";
        clinicalFlow.style.transition = "opacity 0.3s ease";

        // Trigger reflow
        clinicalFlow.offsetHeight;

        clinicalFlow.style.opacity = "1";

        // Scroll to top
        window.scrollTo(0, 0);
      }, 300);
    });
  }

  /**
   * Cache frequently accessed DOM elements
   */
  function cacheDOMElements() {
    DOM.sectionsContainer = document.getElementById("sections-container");
    DOM.sidebar = document.getElementById("sidebar");
    DOM.sidebarOverlay = document.getElementById("sidebar-overlay");
    DOM.mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    DOM.progressFill = document.getElementById("progress-fill");
    DOM.progressText = document.getElementById("progress-text");
    DOM.toastContainer = document.getElementById("toast-container");
  }

  // =========================================
  // SECTION RENDERING
  // =========================================

  /**
   * Render all content sections from FHIR data
   */
  function renderSections() {
    if (!DOM.sectionsContainer || !FHIRData || !FHIRData.sections) {
      console.error("Cannot render sections: missing container or data");
      return;
    }

    const fragment = document.createDocumentFragment();

    FHIRData.sections.forEach((section, index) => {
      const sectionElement = createSectionElement(section, index);
      fragment.appendChild(sectionElement);
    });

    DOM.sectionsContainer.appendChild(fragment);
    AppState.sectionsRendered = true;

    // Update nav links reference after rendering
    DOM.navLinks = document.querySelectorAll(".nav-link");
  }

  /**
   * Create a complete section element
   * @param {Object} section - Section data
   * @param {number} index - Section index
   * @returns {HTMLElement}
   */
  function createSectionElement(section, index) {
    const sectionEl = document.createElement("section");
    sectionEl.className = "content-section";
    sectionEl.id = section.id;
    sectionEl.setAttribute("aria-labelledby", `${section.id}-title`);
    sectionEl.style.animationDelay = `${0.1 + index * 0.05}s`;

    sectionEl.innerHTML = `
            <!-- Section Header -->
            <header class="section-header">
                <div class="section-icon" aria-hidden="true">${section.icon}</div>
                <div class="section-title-group">
                    <span class="section-step">Step ${section.stepNumber}</span>
                    <h2 class="section-title" id="${section.id}-title">${section.title}</h2>
                </div>
            </header>

            <!-- Clinical Story Card -->
            <article class="content-card">
                <header class="card-header">
                    <div class="card-icon story" aria-hidden="true">📖</div>
                    <h3 class="card-title">${section.story.title}</h3>
                </header>
                <div class="card-content">
                    ${section.story.content}
                </div>
            </article>

            <!-- Workflow Card -->
            <article class="content-card">
                <header class="card-header">
                    <div class="card-icon workflow" aria-hidden="true">⚙️</div>
                    <h3 class="card-title">${section.workflow.title}</h3>
                </header>
                <div class="card-content">
                    ${section.workflow.content}
                </div>
            </article>

            <!-- FHIR Explanation Card -->
            <article class="content-card">
                <header class="card-header">
                    <div class="card-icon fhir" aria-hidden="true">🔥</div>
                    <h3 class="card-title">${section.fhirExplanation.title}</h3>
                </header>
                <div class="card-content">
                    ${section.fhirExplanation.content}
                </div>
            </article>

            <!-- FHIR Form Viewer -->
            ${createFormViewer(section.fhirResource, section.id)}
        `;

    return sectionEl;
  }

  /**
   * Create a Form viewer component with Fill Values and Map to FHIR buttons
   * @param {Object} resource - FHIR resource object
   * @param {string} sectionId - Section identifier
   * @returns {string} HTML string
   */
  function createFormViewer(resource, sectionId) {
    const viewerId = `form-viewer-${sectionId}`;
    const resourceType = resource.resourceType;
    const formDef = FormFieldDefinitions[sectionId];

    if (!formDef) {
      // Fallback to JSON viewer if no form definition
      return createJsonViewer(resource, sectionId);
    }

    const jsonString = JSON.stringify(resource, null, 2);

    // Generate form fields HTML
    const fieldsHTML = formDef.fields
      .map((field) => {
        let inputHTML = "";
        const fieldId = `${sectionId}-${field.id}`;

        if (field.type === "select") {
          const optionsHTML = field.options
            .map((opt) => `<option value="${opt}">${opt}</option>`)
            .join("");
          inputHTML = `<select id="${fieldId}" class="form-input" data-fhir-path="${field.fhirPath}">${optionsHTML}</select>`;
        } else if (field.type === "textarea") {
          inputHTML = `<textarea id="${fieldId}" class="form-input form-textarea" data-fhir-path="${field.fhirPath}" rows="3"></textarea>`;
        } else {
          inputHTML = `<input type="${field.type}" id="${fieldId}" class="form-input" data-fhir-path="${field.fhirPath}">`;
        }

        return `
        <div class="form-field">
          <label for="${fieldId}" class="form-label">${field.label}</label>
          ${inputHTML}
          <span class="fhir-path-hint">${field.fhirPath}</span>
        </div>
      `;
      })
      .join("");

    return `
      <div class="fhir-form-viewer" id="${viewerId}" data-section="${sectionId}">
        <header class="form-viewer-header">
          <div class="form-viewer-title">
            <span class="form-icon">📝</span>
            <span>${formDef.title}</span>
          </div>
          <div class="form-viewer-actions">
            <button class="form-btn fill-values-btn" data-section="${sectionId}">
              <span class="btn-icon">✨</span>
              <span class="btn-text">Fill Values</span>
            </button>
            <button class="form-btn map-to-fhir-btn" data-section="${sectionId}" data-json="${escapeHtmlAttr(jsonString)}">
              <span class="btn-icon">🔗</span>
              <span class="btn-text">Map to FHIR</span>
            </button>
          </div>
        </header>
        <div class="form-viewer-content">
          <form class="fhir-form" id="form-${sectionId}" data-section="${sectionId}">
            <div class="form-grid">
              ${fieldsHTML}
            </div>
          </form>
        </div>
        <div class="fhir-json-output" id="json-output-${sectionId}" style="display: none;">
          <header class="json-output-header">
            <div class="json-output-title">
              <span class="json-btn-icon">{ }</span>
              <span>Generated FHIR JSON: </span>
              <span class="resource-type">${resourceType}</span>
            </div>
            <div class="json-output-actions">
              <button class="json-btn copy-btn" data-json="${escapeHtmlAttr(jsonString)}" aria-label="Copy JSON to clipboard">
                <span class="json-btn-icon">📋</span>
                <span class="btn-text">Copy</span>
              </button>
              <button class="json-btn close-json-btn" data-section="${sectionId}">
                <span class="json-btn-icon">✕</span>
                <span class="btn-text">Close</span>
              </button>
            </div>
          </header>
          <div class="json-viewer-content">
            <pre><code class="json-code" id="json-code-${sectionId}"></code></pre>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Create a JSON viewer component
   * @param {Object} resource - FHIR resource object
   * @param {string} sectionId - Section identifier
   * @returns {string} HTML string
   */
  function createJsonViewer(resource, sectionId) {
    const viewerId = `json-viewer-${sectionId}`;
    const resourceType = resource.resourceType;
    const jsonString = JSON.stringify(resource, null, 2);

    return `
            <div class="json-viewer" id="${viewerId}" data-section="${sectionId}">
                <header class="json-viewer-header">
                    <div class="json-viewer-title">
                        <span class="json-btn-icon">{ }</span>
                        <span>FHIR Resource: </span>
                        <span class="resource-type">${resourceType}</span>
                    </div>
                    <div class="json-viewer-actions">
                        <button class="json-btn toggle-btn"
                                data-viewer="${viewerId}"
                                aria-expanded="true"
                                aria-controls="${viewerId}-content">
                            <span class="json-btn-icon">▼</span>
                            <span class="btn-text">Collapse</span>
                        </button>
                        <button class="json-btn fullscreen-btn"
                                data-json="${escapeHtmlAttr(jsonString)}"
                                data-resource-type="${resourceType}"
                                aria-label="View JSON in fullscreen">
                            <span class="json-btn-icon">⛶</span>
                            <span class="btn-text">Fullscreen</span>
                        </button>
                        <button class="json-btn copy-btn"
                                data-json="${escapeHtmlAttr(jsonString)}"
                                aria-label="Copy JSON to clipboard">
                            <span class="json-btn-icon">📋</span>
                            <span class="btn-text">Copy</span>
                        </button>
                    </div>
                </header>
                <div class="json-viewer-content" id="${viewerId}-content">
                    <pre><code class="json-code">${syntaxHighlightJson(jsonString)}</code></pre>
                </div>
            </div>
        `;
  }

  /**
   * Apply syntax highlighting to JSON string
   * @param {string} json - JSON string
   * @returns {string} HTML with syntax highlighting
   */
  function syntaxHighlightJson(json) {
    // Escape HTML first
    json = escapeHtml(json);

    // Apply syntax highlighting with regex
    return (
      json
        // Keys (property names)
        .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
        // String values
        .replace(/: "([^"]*)"/g, ': <span class="json-string">"$1"</span>')
        // Numbers
        .replace(/: (-?\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
        // Booleans
        .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
        // Null
        .replace(/: (null)/g, ': <span class="json-null">$1</span>')
        // Brackets
        .replace(/(\{|\}|\[|\])/g, '<span class="json-bracket">$1</span>')
    );
  }

  /**
   * Escape HTML special characters
   * @param {string} str - Input string
   * @returns {string} Escaped string
   */
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Escape string for use in HTML attributes (including quotes)
   * @param {string} str - Input string
   * @returns {string} Escaped string safe for HTML attributes
   */
  function escapeHtmlAttr(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // =========================================
  // SCROLLSPY NAVIGATION
  // =========================================

  /**
   * Initialize scrollspy using Intersection Observer
   */
  function initScrollspy() {
    const options = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    AppState.scrollspyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateActiveNavLink(entry.target.id);
        }
      });
    }, options);

    // Observe all sections after they're rendered
    setTimeout(() => {
      document.querySelectorAll(".content-section").forEach((section) => {
        AppState.scrollspyObserver.observe(section);
      });
    }, 100);
  }

  /**
   * Update active navigation link
   * @param {string} sectionId - Active section ID
   */
  function updateActiveNavLink(sectionId) {
    if (AppState.activeSection === sectionId) return;

    AppState.activeSection = sectionId;

    if (!DOM.navLinks) {
      DOM.navLinks = document.querySelectorAll(".nav-link");
    }

    DOM.navLinks.forEach((link) => {
      const linkSection = link.getAttribute("data-section");
      if (linkSection === sectionId) {
        link.classList.add("active");
        link.setAttribute("aria-current", "true");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }

  // =========================================
  // SMOOTH SCROLLING
  // =========================================

  /**
   * Initialize smooth scroll for navigation links
   */
  function initSmoothScroll() {
    document.addEventListener("click", (e) => {
      const navLink = e.target.closest(".nav-link");
      if (navLink) {
        e.preventDefault();
        const targetId = navLink.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Close mobile menu if open
          if (AppState.mobileMenuOpen) {
            closeMobileMenu();
          }

          // Smooth scroll to section
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          // Update URL without triggering scroll
          history.pushState(null, "", `#${targetId}`);
        }
      }
    });
  }

  // =========================================
  // MOBILE MENU
  // =========================================

  /**
   * Initialize mobile menu toggle
   */
  function initMobileMenu() {
    if (!DOM.mobileMenuToggle) return;

    DOM.mobileMenuToggle.addEventListener("click", toggleMobileMenu);

    if (DOM.sidebarOverlay) {
      DOM.sidebarOverlay.addEventListener("click", closeMobileMenu);
    }

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && AppState.mobileMenuOpen) {
        closeMobileMenu();
      }
    });
  }

  /**
   * Toggle mobile menu state
   */
  function toggleMobileMenu() {
    if (AppState.mobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  /**
   * Open mobile menu
   */
  function openMobileMenu() {
    AppState.mobileMenuOpen = true;
    DOM.sidebar.classList.add("open");
    DOM.sidebarOverlay.classList.add("active");
    DOM.mobileMenuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  /**
   * Close mobile menu
   */
  function closeMobileMenu() {
    AppState.mobileMenuOpen = false;
    DOM.sidebar.classList.remove("open");
    DOM.sidebarOverlay.classList.remove("active");
    DOM.mobileMenuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  // =========================================
  // JSON VIEWER INTERACTIONS
  // =========================================

  /**
   * Initialize JSON viewer interactions
   */
  function initJsonViewers() {
    document.addEventListener("click", (e) => {
      // Toggle button
      const toggleBtn = e.target.closest(".toggle-btn");
      if (toggleBtn) {
        toggleJsonViewer(toggleBtn);
        return;
      }

      // Fullscreen button
      const fullscreenBtn = e.target.closest(".fullscreen-btn");
      if (fullscreenBtn) {
        openFullscreenJson(fullscreenBtn);
        return;
      }

      // Copy button
      const copyBtn = e.target.closest(".copy-btn");
      if (copyBtn) {
        copyJsonToClipboard(copyBtn);
        return;
      }

      // Close fullscreen modal
      const closeFullscreenBtn = e.target.closest(".fullscreen-close");
      if (closeFullscreenBtn) {
        closeFullscreenJson();
        return;
      }

      // Click on overlay to close
      if (e.target.classList.contains("fullscreen-modal")) {
        closeFullscreenJson();
        return;
      }
    });

    // ESC key to close fullscreen
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const modal = document.querySelector(".fullscreen-modal.active");
        if (modal) {
          closeFullscreenJson();
        }
      }
    });
  }

  /**
   * Toggle JSON viewer expand/collapse
   * @param {HTMLElement} button - Toggle button element
   */
  function toggleJsonViewer(button) {
    const viewerId = button.getAttribute("data-viewer");
    const content = document.getElementById(`${viewerId}-content`);
    const icon = button.querySelector(".json-btn-icon");
    const text = button.querySelector(".btn-text");

    if (!content) return;

    const isExpanded = button.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
      // Collapse
      content.classList.add("collapsed");
      button.setAttribute("aria-expanded", "false");
      icon.textContent = "▶";
      text.textContent = "Expand";
      AppState.expandedJsonViewers.delete(viewerId);
    } else {
      // Expand
      content.classList.remove("collapsed");
      button.setAttribute("aria-expanded", "true");
      icon.textContent = "▼";
      text.textContent = "Collapse";
      AppState.expandedJsonViewers.add(viewerId);
    }
  }

  /**
   * Copy JSON to clipboard
   * @param {HTMLElement} button - Copy button element
   */
  async function copyJsonToClipboard(button) {
    const json = button.getAttribute("data-json");

    try {
      // Decode the escaped HTML
      const textarea = document.createElement("textarea");
      textarea.innerHTML = json;
      const decodedJson = textarea.value;

      await navigator.clipboard.writeText(decodedJson);

      // Visual feedback
      button.classList.add("copied");
      const text = button.querySelector(".btn-text");
      const originalText = text.textContent;
      text.textContent = "Copied!";

      // Show toast
      showToast("JSON copied to clipboard!", "success");

      // Reset button after delay
      setTimeout(() => {
        button.classList.remove("copied");
        text.textContent = originalText;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      showToast("Failed to copy to clipboard", "error");
    }
  }

  /**
   * Open JSON in fullscreen modal
   * @param {HTMLElement} button - Fullscreen button element
   */
  function openFullscreenJson(button) {
    const json = button.getAttribute("data-json");
    const resourceType = button.getAttribute("data-resource-type");

    // Decode the escaped HTML
    const textarea = document.createElement("textarea");
    textarea.innerHTML = json;
    const decodedJson = textarea.value;

    // Create or get modal
    let modal = document.getElementById("fullscreen-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "fullscreen-modal";
      modal.className = "fullscreen-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-labelledby", "fullscreen-modal-title");
      document.body.appendChild(modal);
    }

    // Create modal content
    modal.innerHTML = `
            <div class="fullscreen-modal-content">
                <header class="fullscreen-modal-header">
                    <div class="fullscreen-modal-title" id="fullscreen-modal-title">
                        <span class="json-btn-icon">{ }</span>
                        <span>FHIR Resource: </span>
                        <span class="resource-type">${resourceType}</span>
                    </div>
                    <div class="fullscreen-modal-actions">
                        <button class="json-btn copy-btn-fullscreen"
                                data-json="${escapeHtmlAttr(json)}"
                                aria-label="Copy JSON to clipboard">
                            <span class="json-btn-icon">📋</span>
                            <span class="btn-text">Copy</span>
                        </button>
                        <button class="json-btn fullscreen-close"
                                aria-label="Close fullscreen view">
                            <span class="json-btn-icon">✕</span>
                            <span class="btn-text">Close</span>
                        </button>
                    </div>
                </header>
                <div class="fullscreen-modal-body">
                    <pre><code class="json-code">${syntaxHighlightJson(decodedJson)}</code></pre>
                </div>
            </div>
        `;

    // Add copy functionality to fullscreen copy button
    const copyBtn = modal.querySelector(".copy-btn-fullscreen");
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(decodedJson);
        copyBtn.classList.add("copied");
        const text = copyBtn.querySelector(".btn-text");
        const originalText = text.textContent;
        text.textContent = "Copied!";
        showToast("JSON copied to clipboard!", "success");
        setTimeout(() => {
          copyBtn.classList.remove("copied");
          text.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
        showToast("Failed to copy to clipboard", "error");
      }
    });

    // Show modal
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Focus on close button for accessibility
    setTimeout(() => {
      modal.querySelector(".fullscreen-close").focus();
    }, 100);
  }

  /**
   * Close fullscreen JSON modal
   */
  function closeFullscreenJson() {
    const modal = document.getElementById("fullscreen-modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";

      // Animation delay before cleanup
      setTimeout(() => {
        modal.innerHTML = "";
      }, 300);
    }
  }

  // =========================================
  // FORM VIEWER INTERACTIONS
  // =========================================

  /**
   * Initialize form viewer interactions
   */
  function initFormViewers() {
    document.addEventListener("click", (e) => {
      // Fill Values button
      const fillBtn = e.target.closest(".fill-values-btn");
      if (fillBtn) {
        fillFormValues(fillBtn.getAttribute("data-section"));
        return;
      }

      // Map to FHIR button
      const mapBtn = e.target.closest(".map-to-fhir-btn");
      if (mapBtn) {
        mapToFhir(mapBtn.getAttribute("data-section"));
        return;
      }

      // Close JSON output
      const closeJsonBtn = e.target.closest(".close-json-btn");
      if (closeJsonBtn) {
        closeJsonOutput(closeJsonBtn.getAttribute("data-section"));
        return;
      }
    });
  }

  /**
   * Fill form with sample values
   * @param {string} sectionId - Section identifier
   */
  function fillFormValues(sectionId) {
    const formDef = FormFieldDefinitions[sectionId];
    if (!formDef) return;

    const form = document.getElementById(`form-${sectionId}`);
    if (!form) return;

    // Animate filling each field
    formDef.fields.forEach((field, index) => {
      const input = document.getElementById(`${sectionId}-${field.id}`);
      if (input) {
        setTimeout(() => {
          input.classList.add("filling");

          if (field.type === "select") {
            // Find the option that matches the value
            const options = Array.from(input.options);
            const matchingOption = options.find(
              (opt) =>
                opt.value === field.value || opt.value.startsWith(field.value),
            );
            if (matchingOption) {
              input.value = matchingOption.value;
            }
          } else {
            input.value = field.value;
          }

          // Trigger input event for any listeners
          input.dispatchEvent(new Event("input", { bubbles: true }));

          setTimeout(() => {
            input.classList.remove("filling");
            input.classList.add("filled");
          }, 300);
        }, index * 80); // Stagger the animations
      }
    });

    AppState.filledForms.add(sectionId);
    showToast(`Form filled with sample patient data!`, "success");
  }

  /**
   * Map form values to FHIR JSON and display
   * @param {string} sectionId - Section identifier
   */
  function mapToFhir(sectionId) {
    const formDef = FormFieldDefinitions[sectionId];
    if (!formDef) return;

    // Check if form has been filled
    if (!AppState.filledForms.has(sectionId)) {
      showToast("Please fill the form first!", "info");
      return;
    }

    // Get form values
    const formValues = {};
    formDef.fields.forEach((field) => {
      const input = document.getElementById(`${sectionId}-${field.id}`);
      if (input) {
        formValues[field.fhirPath] = input.value;
      }
    });

    // Get the original FHIR resource from FHIRData
    const section = FHIRData.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const jsonString = JSON.stringify(section.fhirResource, null, 2);

    // Highlight the mapped fields in the JSON
    const highlightedJson = syntaxHighlightJsonWithMapping(
      jsonString,
      formValues,
      formDef.fields,
    );

    // Show the JSON output
    const jsonOutput = document.getElementById(`json-output-${sectionId}`);
    const jsonCode = document.getElementById(`json-code-${sectionId}`);

    if (jsonOutput && jsonCode) {
      jsonCode.innerHTML = highlightedJson;
      jsonOutput.style.display = "block";
      jsonOutput.classList.add("visible");

      // Scroll to the JSON output
      setTimeout(() => {
        jsonOutput.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }

    showToast("Form values mapped to FHIR JSON!", "success");
  }

  /**
   * Close JSON output panel
   * @param {string} sectionId - Section identifier
   */
  function closeJsonOutput(sectionId) {
    const jsonOutput = document.getElementById(`json-output-${sectionId}`);
    if (jsonOutput) {
      jsonOutput.classList.remove("visible");
      setTimeout(() => {
        jsonOutput.style.display = "none";
      }, 300);
    }
  }

  /**
   * Syntax highlight JSON with field mapping indicators
   * @param {string} json - JSON string
   * @param {Object} formValues - Form values mapped by FHIR path
   * @param {Array} fields - Field definitions
   * @returns {string} HTML with syntax highlighting and mapping indicators
   */
  function syntaxHighlightJsonWithMapping(json, formValues, fields) {
    // First apply normal syntax highlighting
    let highlighted = syntaxHighlightJson(json);

    // Then add mapping highlights for relevant fields
    fields.forEach((field) => {
      const pathParts = field.fhirPath.split(".");
      const lastPart = pathParts[pathParts.length - 1].replace(/\[\d+\]/g, "");

      // Highlight keys that match the field paths
      const keyRegex = new RegExp(
        `(<span class="json-key">"${lastPart}"</span>)`,
        "g",
      );
      highlighted = highlighted.replace(
        keyRegex,
        `<span class="mapped-field" title="Mapped from: ${field.label}">$1<span class="mapping-indicator">←</span></span>`,
      );
    });

    return highlighted;
  }

  // =========================================
  // PROGRESS TRACKING
  // =========================================

  /**
   * Update progress indicator based on scroll position
   */
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(100, Math.round((scrollTop / docHeight) * 100));

    if (DOM.progressFill) {
      DOM.progressFill.style.width = `${progress}%`;
    }

    if (DOM.progressText) {
      DOM.progressText.textContent = `${progress}% Complete`;
    }
  }

  // =========================================
  // TOAST NOTIFICATIONS
  // =========================================

  /**
   * Show a toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, error, info)
   */
  function showToast(message, type = "info") {
    if (!DOM.toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.setAttribute("role", "alert");

    const icons = {
      success: "✓",
      error: "✕",
      info: "ℹ",
    };

    toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
        `;

    DOM.toastContainer.appendChild(toast);

    // Auto-remove after delay
    setTimeout(() => {
      toast.style.animation = "fadeOut 0.3s ease-out forwards";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  // =========================================
  // UTILITY FUNCTIONS
  // =========================================

  /**
   * Throttle function execution
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in ms
   * @returns {Function}
   */
  function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Debounce function execution
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function}
   */
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // =========================================
  // ACCESSIBILITY ENHANCEMENTS
  // =========================================

  /**
   * Handle keyboard navigation in sidebar
   */
  function initKeyboardNav() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    sidebar.addEventListener("keydown", (e) => {
      const navLinks = Array.from(sidebar.querySelectorAll(".nav-link"));
      const currentIndex = navLinks.indexOf(document.activeElement);

      if (currentIndex === -1) return;

      let nextIndex;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          nextIndex = (currentIndex + 1) % navLinks.length;
          navLinks[nextIndex].focus();
          break;
        case "ArrowUp":
          e.preventDefault();
          nextIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
          navLinks[nextIndex].focus();
          break;
        case "Home":
          e.preventDefault();
          navLinks[0].focus();
          break;
        case "End":
          e.preventDefault();
          navLinks[navLinks.length - 1].focus();
          break;
      }
    });
  }

  // =========================================
  // ANIMATION ON SCROLL REVEAL
  // =========================================

  /**
   * Initialize scroll reveal animations for cards
   */
  function initScrollReveal() {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.1,
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe cards after sections are rendered
    setTimeout(() => {
      document.querySelectorAll(".content-card").forEach((card) => {
        revealObserver.observe(card);
      });
    }, 200);
  }

  // =========================================
  // URL HASH HANDLING
  // =========================================

  /**
   * Handle initial URL hash for direct linking
   */
  function handleInitialHash() {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 500);
    }
  }

  // =========================================
  // PUBLIC API
  // =========================================
  window.FHIRApp = {
    showToast,
    toggleJsonViewer,
    getActiveSection: () => AppState.activeSection,
    getSectionsRendered: () => AppState.sectionsRendered,
  };

  // =========================================
  // INITIALIZE ON DOM READY
  // =========================================
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      init();
      initKeyboardNav();
      initScrollReveal();
      handleInitialHash();
    });
  } else {
    init();
    initKeyboardNav();
    initScrollReveal();
    handleInitialHash();
  }
})();

// Add fadeOut keyframe animation dynamically
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(styleSheet);

// =========================================
// THEME TOGGLE
// =========================================
(function () {
  const THEME_KEY = "fhir-platform-theme";
  const themeToggle = document.getElementById("theme-toggle");

  // Get saved theme or detect system preference, default to dark
  function getSavedTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    // Check system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      return "light";
    }
    return "dark";
  }

  // Apply theme to document
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);

    // Update toggle button aria-label
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
      );
    }
  }

  // Toggle between themes
  function toggleTheme() {
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
  }

  // Initialize theme on page load
  applyTheme(getSavedTheme());

  // Listen for system theme changes
  if (window.matchMedia) {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem(THEME_KEY)) {
          applyTheme(e.matches ? "dark" : "light");
        }
      });
  }

  // Add click handler
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Also support keyboard
  if (themeToggle) {
    themeToggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleTheme();
      }
    });
  }
})();
