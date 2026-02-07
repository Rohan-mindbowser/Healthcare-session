/**
 * FHIR Data Module
 * Contains all FHIR R4 resources and educational content for Maria Santos' patient journey
 *
 * Resource ID Conventions:
 * - Patient: patient-maria-santos
 * - Practitioner: practitioner-dr-chen (Primary Care), practitioner-dr-patel (Cardiologist)
 * - Organization: organization-city-general
 * - Location: location-cardiology-dept
 * - Appointment: appointment-001
 * - Encounter: encounter-001
 * - ServiceRequest: servicerequest-001 (Lab), servicerequest-002 (ECG)
 * - Observation: observation-001 (BP), observation-002 (Heart Rate), observation-003 (Cholesterol)
 * - Condition: condition-001 (Hypertension)
 * - AllergyIntolerance: allergyintolerance-001 (Penicillin)
 * - Medication: medication-001 (Lisinopril)
 * - MedicationRequest: medicationrequest-001
 * - Procedure: procedure-001 (ECG)
 * - DiagnosticReport: diagnosticreport-001
 * - Immunization: immunization-001 (Flu)
 */

const FHIRData = {
  // =========================================
  // PATIENT CORE DATA
  // =========================================
  patient: {
    resourceType: "Patient",
    id: "patient-maria-santos",
    meta: {
      versionId: "1",
      lastUpdated: "2024-01-15T09:00:00Z",
      profile: [
        "http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient",
      ],
    },
    identifier: [
      {
        use: "official",
        type: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0203",
              code: "MR",
              display: "Medical Record Number",
            },
          ],
        },
        system: "http://citygeneralhospital.org/mrn",
        value: "MS-2024-0892",
      },
    ],
    active: true,
    name: [
      {
        use: "official",
        family: "Santos",
        given: ["Maria", "Elena"],
        prefix: ["Mrs."],
      },
    ],
    telecom: [
      {
        system: "phone",
        value: "(555) 234-5678",
        use: "home",
      },
      {
        system: "email",
        value: "maria.santos@email.com",
        use: "home",
      },
    ],
    gender: "female",
    birthDate: "1979-03-15",
    address: [
      {
        use: "home",
        type: "physical",
        line: ["456 Oak Street", "Apt 12B"],
        city: "Springfield",
        state: "IL",
        postalCode: "62701",
        country: "US",
      },
    ],
    maritalStatus: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
          code: "M",
          display: "Married",
        },
      ],
    },
    communication: [
      {
        language: {
          coding: [
            {
              system: "urn:ietf:bcp:47",
              code: "en",
              display: "English",
            },
          ],
        },
        preferred: true,
      },
    ],
  },

  // =========================================
  // SECTION CONTENT DATA
  // =========================================
  sections: [
    // =========================================
    // 1. APPOINTMENT
    // =========================================
    {
      id: "appointment",
      icon: "📅",
      stepNumber: 1,
      title: "Appointment Scheduling",
      story: {
        title: "Maria's Journey Begins",
        content: `
                    <p>Maria Santos, a 45-year-old elementary school teacher, has been experiencing <strong>persistent chest discomfort</strong> and <strong>shortness of breath</strong> for the past two weeks. The symptoms worsen when she climbs stairs at school or walks briskly.</p>
                    <p>Concerned about her health, Maria calls <strong>City General Hospital</strong> to schedule an appointment. The scheduling coordinator finds an available slot with <strong>Dr. Sarah Chen</strong>, a primary care physician, for the following Monday at 10:00 AM.</p>
                    <div class="highlight-box">
                        <div class="highlight-box-title">📍 Clinical Context</div>
                        <p>Scheduling is often the patient's first interaction with the healthcare system. The appointment captures the patient's availability, the provider's schedule, and the reason for the visit.</p>
                    </div>
                `,
      },
      workflow: {
        title: "Healthcare Workflow: Scheduling",
        content: `
                    <p>In healthcare operations, appointment scheduling involves multiple systems working together:</p>
                    <ol>
                        <li><strong>Patient Registration:</strong> Verify or create patient demographics</li>
                        <li><strong>Provider Availability:</strong> Check schedules and open slots</li>
                        <li><strong>Resource Allocation:</strong> Reserve examination rooms, equipment</li>
                        <li><strong>Confirmation:</strong> Send appointment reminders via preferred channels</li>
                    </ol>
                    <p>The <strong>Appointment</strong> resource links all these elements and tracks the booking lifecycle from proposed to completed.</p>
                `,
      },
      fhirExplanation: {
        title: "FHIR Resource: Appointment",
        content: `
                    <p>The <strong>Appointment</strong> resource represents a booking of a healthcare event among patients, practitioners, and locations. It's designed to support the scheduling workflow.</p>
                    <div class="field-list">
                        <div class="field-item">
                            <span class="field-name">status</span>
                            <span class="field-description">Current state: proposed | pending | booked | arrived | fulfilled | cancelled | noshow</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">serviceType</span>
                            <span class="field-description">Type of appointment (e.g., General Checkup, Cardiology Consultation)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">reasonCode</span>
                            <span class="field-description">Coded reason for the appointment (chief complaint)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">start / end</span>
                            <span class="field-description">DateTime boundaries for the appointment slot</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">participant</span>
                            <span class="field-description">List of attendees: Patient, Practitioner, Location with acceptance status</span>
                        </div>
                    </div>
                    <div class="highlight-box teal">
                        <div class="highlight-box-title">🔗 Resource Relationships</div>
                        <p><strong>Patient</strong> → The person receiving care<br>
                        <strong>Practitioner</strong> → The healthcare provider<br>
                        <strong>Location</strong> → Where the appointment takes place</p>
                    </div>
                `,
      },
      fhirResource: {
        resourceType: "Appointment",
        id: "appointment-001",
        meta: {
          versionId: "2",
          lastUpdated: "2024-01-15T10:30:00Z",
        },
        status: "fulfilled",
        serviceCategory: [
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/service-category",
                code: "17",
                display: "General Practice",
              },
            ],
          },
        ],
        serviceType: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/service-type",
                code: "124",
                display: "General Practice",
              },
            ],
          },
        ],
        specialty: [
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "394814009",
                display: "General practice",
              },
            ],
          },
        ],
        appointmentType: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0276",
              code: "ROUTINE",
              display: "Routine appointment",
            },
          ],
        },
        reasonCode: [
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "29857009",
                display: "Chest pain",
              },
            ],
            text: "Chest discomfort and shortness of breath",
          },
        ],
        priority: 5,
        description: "Initial consultation for chest symptoms",
        start: "2024-01-15T10:00:00-05:00",
        end: "2024-01-15T10:30:00-05:00",
        minutesDuration: 30,
        created: "2024-01-12T14:23:00-05:00",
        comment: "Patient reports symptoms worsening with physical activity",
        participant: [
          {
            actor: {
              reference: "Patient/patient-maria-santos",
              display: "Maria Santos",
            },
            required: "required",
            status: "accepted",
          },
          {
            actor: {
              reference: "Practitioner/practitioner-dr-chen",
              display: "Dr. Sarah Chen",
            },
            required: "required",
            status: "accepted",
          },
          {
            actor: {
              reference: "Location/location-exam-room-3",
              display: "Examination Room 3",
            },
            required: "required",
            status: "accepted",
          },
        ],
      },
    },

    // =========================================
    // 2. ENCOUNTER
    // =========================================
    {
      id: "encounter",
      icon: "🏥",
      stepNumber: 2,
      title: "Encounter & Visit Modeling",
      story: {
        title: "Maria Arrives at the Hospital",
        content: `
                    <p>On Monday morning, Maria arrives at City General Hospital. She checks in at the front desk, where the receptionist verifies her insurance and updates her contact information.</p>
                    <p>At 10:00 AM, a nurse calls Maria back to <strong>Examination Room 3</strong>. The nurse takes her vital signs: <strong>blood pressure 148/92 mmHg</strong> (elevated), <strong>heart rate 88 bpm</strong>, and <strong>temperature 98.4°F</strong>.</p>
                    <p>Dr. Chen enters and begins the consultation, asking about Maria's symptoms, medical history, and lifestyle. This marks the official start of Maria's <strong>clinical encounter</strong>.</p>
                `,
      },
      workflow: {
        title: "Healthcare Workflow: Patient Visits",
        content: `
                    <p>An <strong>encounter</strong> represents any interaction between a patient and healthcare provider(s). Encounters can be:</p>
                    <ul>
                        <li><strong>Ambulatory:</strong> Outpatient clinic visits</li>
                        <li><strong>Emergency:</strong> ER visits</li>
                        <li><strong>Inpatient:</strong> Hospital admissions</li>
                        <li><strong>Virtual:</strong> Telehealth consultations</li>
                    </ul>
                    <p>Each encounter serves as an <strong>organizing container</strong> for all clinical activities: observations, diagnoses, procedures, and orders created during that visit.</p>
                    <div class="highlight-box">
                        <div class="highlight-box-title">💡 Key Concept</div>
                        <p>The Encounter resource is central to clinical documentation. Nearly all clinical resources reference an Encounter to establish context.</p>
                    </div>
                `,
      },
      fhirExplanation: {
        title: "FHIR Resource: Encounter",
        content: `
                    <p>The <strong>Encounter</strong> resource tracks the actual healthcare interaction. It captures when, where, why, and with whom the visit occurred.</p>
                    <div class="field-list">
                        <div class="field-item">
                            <span class="field-name">status</span>
                            <span class="field-description">Current state: planned | arrived | triaged | in-progress | onleave | finished | cancelled</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">class</span>
                            <span class="field-description">Classification of care setting (AMB=ambulatory, EMER=emergency, IMP=inpatient)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">type</span>
                            <span class="field-description">Specific type of encounter (e.g., consultation, follow-up)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">subject</span>
                            <span class="field-description">Reference to the Patient</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">participant</span>
                            <span class="field-description">Healthcare providers involved in the encounter</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">period</span>
                            <span class="field-description">Start and end times of the encounter</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">reasonCode</span>
                            <span class="field-description">Coded reason for the encounter (presenting complaint)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">diagnosis</span>
                            <span class="field-description">List of diagnoses relevant to this encounter</span>
                        </div>
                    </div>
                `,
      },
      fhirResource: {
        resourceType: "Encounter",
        id: "encounter-001",
        meta: {
          versionId: "3",
          lastUpdated: "2024-01-15T11:45:00Z",
          profile: [
            "http://hl7.org/fhir/us/core/StructureDefinition/us-core-encounter",
          ],
        },
        identifier: [
          {
            use: "official",
            system: "http://citygeneralhospital.org/encounter",
            value: "ENC-2024-789456",
          },
        ],
        status: "finished",
        class: {
          system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
          code: "AMB",
          display: "ambulatory",
        },
        type: [
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "11429006",
                display: "Consultation",
              },
            ],
            text: "Primary Care Consultation",
          },
        ],
        serviceType: {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: "394814009",
              display: "General practice",
            },
          ],
        },
        priority: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
              code: "R",
              display: "routine",
            },
          ],
        },
        subject: {
          reference: "Patient/patient-maria-santos",
          display: "Maria Santos",
        },
        participant: [
          {
            type: [
              {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
                    code: "PPRF",
                    display: "primary performer",
                  },
                ],
              },
            ],
            individual: {
              reference: "Practitioner/practitioner-dr-chen",
              display: "Dr. Sarah Chen, MD",
            },
          },
        ],
        appointment: [
          {
            reference: "Appointment/appointment-001",
          },
        ],
        period: {
          start: "2024-01-15T10:00:00-05:00",
          end: "2024-01-15T11:30:00-05:00",
        },
        reasonCode: [
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "29857009",
                display: "Chest pain",
              },
            ],
            text: "Chest discomfort with exertion",
          },
        ],
        diagnosis: [
          {
            condition: {
              reference: "Condition/condition-001",
              display: "Essential Hypertension",
            },
            use: {
              coding: [
                {
                  system:
                    "http://terminology.hl7.org/CodeSystem/diagnosis-role",
                  code: "billing",
                  display: "Billing",
                },
              ],
            },
            rank: 1,
          },
        ],
        location: [
          {
            location: {
              reference: "Location/location-exam-room-3",
              display: "Examination Room 3",
            },
            status: "completed",
          },
        ],
        serviceProvider: {
          reference: "Organization/organization-city-general",
          display: "City General Hospital",
        },
      },
    },

    // =========================================
    // 3. SERVICE REQUEST
    // =========================================
    {
      id: "service-request",
      icon: "📋",
      stepNumber: 3,
      title: "ServiceRequest & Orders",
      story: {
        title: "Dr. Chen Orders Tests",
        content: `
                    <p>After examining Maria and reviewing her symptoms, Dr. Chen is concerned about potential cardiovascular issues. Maria's elevated blood pressure and chest symptoms warrant further investigation.</p>
                    <p>Dr. Chen explains her assessment: <em>"Maria, I'd like to order some tests to get a clearer picture of what's happening. We'll do a comprehensive metabolic panel, a lipid panel, and an electrocardiogram (ECG)."</em></p>
                    <p>The doctor enters the orders into the hospital's electronic health record system, which generates the necessary <strong>ServiceRequest</strong> resources.</p>
                `,
      },
      workflow: {
        title: "Healthcare Workflow: Clinical Orders",
        content: `
                    <p>Clinical orders drive the healthcare workflow. When a physician identifies a need for tests or procedures:</p>
                    <ol>
                        <li><strong>Order Entry:</strong> Physician creates order in EHR (CPOE system)</li>
                        <li><strong>Clinical Decision Support:</strong> System checks for interactions, duplicates, allergies</li>
                        <li><strong>Order Transmission:</strong> Request sent to performing department (lab, radiology)</li>
                        <li><strong>Order Fulfillment:</strong> Department performs the test</li>
                        <li><strong>Results Return:</strong> Results linked back to the original order</li>
                    </ol>
                    <div class="highlight-box teal">
                        <div class="highlight-box-title">🔄 Order Lifecycle</div>
                        <p><strong>draft</strong> → <strong>active</strong> → <strong>completed</strong> (or revoked/cancelled)</p>
                    </div>
                `,
      },
      fhirExplanation: {
        title: "FHIR Resource: ServiceRequest",
        content: `
                    <p>The <strong>ServiceRequest</strong> resource represents a request for a procedure, diagnostic, or other service. It replaced the older DiagnosticOrder and ProcedureRequest resources in FHIR R4.</p>
                    <div class="field-list">
                        <div class="field-item">
                            <span class="field-name">status</span>
                            <span class="field-description">Order state: draft | active | on-hold | completed | revoked</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">intent</span>
                            <span class="field-description">Purpose: proposal | plan | directive | order | option</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">category</span>
                            <span class="field-description">Classification (e.g., laboratory, imaging, procedure)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">code</span>
                            <span class="field-description">What is being requested (LOINC, SNOMED, CPT codes)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">subject</span>
                            <span class="field-description">Reference to the Patient</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">encounter</span>
                            <span class="field-description">Reference to the clinical encounter context</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">requester</span>
                            <span class="field-description">Who authorized the request (ordering provider)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">performer</span>
                            <span class="field-description">Who should perform the service</span>
                        </div>
                    </div>
                `,
      },
      fhirResource: {
        resourceType: "ServiceRequest",
        id: "servicerequest-001",
        meta: {
          versionId: "1",
          lastUpdated: "2024-01-15T10:45:00Z",
        },
        identifier: [
          {
            use: "official",
            system: "http://citygeneralhospital.org/orders",
            value: "ORD-2024-456123",
          },
        ],
        status: "completed",
        intent: "order",
        category: [
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "108252007",
                display: "Laboratory procedure",
              },
            ],
          },
        ],
        priority: "routine",
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: "57698-3",
              display: "Lipid panel with direct LDL",
            },
          ],
          text: "Comprehensive Lipid Panel",
        },
        subject: {
          reference: "Patient/patient-maria-santos",
          display: "Maria Santos",
        },
        encounter: {
          reference: "Encounter/encounter-001",
        },
        occurrenceDateTime: "2024-01-15T11:00:00-05:00",
        authoredOn: "2024-01-15T10:45:00-05:00",
        requester: {
          reference: "Practitioner/practitioner-dr-chen",
          display: "Dr. Sarah Chen, MD",
        },
        performer: [
          {
            reference: "Organization/organization-city-general-lab",
            display: "City General Hospital Laboratory",
          },
        ],
        reasonCode: [
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "29857009",
                display: "Chest pain",
              },
            ],
            text: "Evaluate cardiovascular risk for patient presenting with chest discomfort and shortness of breath",
          },
        ],
        note: [
          {
            text: "Patient presenting with chest discomfort and shortness of breath for 2 weeks, worsening with exertion. Initial BP elevated at 148/92 mmHg. Lipid panel ordered to evaluate cardiovascular risk factors. Results will inform diagnosis and treatment planning for suspected hypertension and possible hyperlipidemia.",
          },
        ],
      },
    },

    // =========================================
    // 4. OBSERVATION
    // =========================================
    {
      id: "observation",
      icon: "🔬",
      stepNumber: 4,
      title: "Observation & Measurements",
      story: {
        title: "Lab Results Come In",
        content: `
                    <p>Maria's blood is drawn at the hospital lab. While waiting, the nurse performs an ECG which shows <strong>normal sinus rhythm</strong> with no acute changes.</p>
                    <p>Within two hours, the lab results are available in the system:</p>
                    <ul>
                        <li><strong>Total Cholesterol:</strong> 248 mg/dL (High - goal is <200)</li>
                        <li><strong>LDL Cholesterol:</strong> 168 mg/dL (High - goal is <100)</li>
                        <li><strong>HDL Cholesterol:</strong> 45 mg/dL (Low - goal is >60)</li>
                        <li><strong>Triglycerides:</strong> 175 mg/dL (Borderline high)</li>
                    </ul>
                    <p>Combined with her elevated blood pressure (148/92 mmHg), these results indicate Maria has <strong>cardiovascular risk factors</strong> that need to be addressed.</p>
                `,
      },
      workflow: {
        title: "Healthcare Workflow: Clinical Observations",
        content: `
                    <p><strong>Observations</strong> are the foundational building blocks of clinical documentation. They capture measurable data about a patient:</p>
                    <ul>
                        <li><strong>Vital Signs:</strong> Blood pressure, heart rate, temperature, respiratory rate</li>
                        <li><strong>Laboratory Results:</strong> Blood chemistry, hematology, urinalysis</li>
                        <li><strong>Assessment Scores:</strong> Pain scales, functional assessments</li>
                        <li><strong>Device Readings:</strong> Glucose monitors, pulse oximeters</li>
                    </ul>
                    <p>Observations often reference the <strong>ServiceRequest</strong> that initiated them and are grouped into <strong>DiagnosticReports</strong> for interpretation.</p>
                `,
      },
      fhirExplanation: {
        title: "FHIR Resource: Observation",
        content: `
                    <p>The <strong>Observation</strong> resource captures measurements, test results, and other clinically relevant assertions about a patient. It's one of the most frequently used FHIR resources.</p>
                    <div class="field-list">
                        <div class="field-item">
                            <span class="field-name">status</span>
                            <span class="field-description">Result status: registered | preliminary | final | amended | cancelled</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">category</span>
                            <span class="field-description">Classification: vital-signs | laboratory | imaging | procedure</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">code</span>
                            <span class="field-description">What was observed (LOINC code for lab tests)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">subject</span>
                            <span class="field-description">Who/what the observation is about</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">effectiveDateTime</span>
                            <span class="field-description">When the observation was made</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">value[x]</span>
                            <span class="field-description">The result (can be Quantity, CodeableConcept, string, etc.)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">interpretation</span>
                            <span class="field-description">High, low, normal, abnormal flags</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">referenceRange</span>
                            <span class="field-description">Normal range for comparison</span>
                        </div>
                    </div>
                `,
      },
      fhirResource: {
        resourceType: "Bundle",
        id: "bundle-observations-maria",
        type: "collection",
        entry: [
          {
            fullUrl: "urn:uuid:observation-bp-001",
            resource: {
              resourceType: "Observation",
              id: "observation-bp-001",
              meta: {
                versionId: "1",
                lastUpdated: "2024-01-15T10:10:00Z",
                profile: [
                  "http://hl7.org/fhir/us/core/StructureDefinition/us-core-blood-pressure",
                ],
              },
              identifier: [
                {
                  use: "official",
                  system: "http://citygeneralhospital.org/vitals",
                  value: "VS-2024-789456-BP",
                },
              ],
              status: "final",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/observation-category",
                      code: "vital-signs",
                      display: "Vital Signs",
                    },
                  ],
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://loinc.org",
                    code: "85354-9",
                    display: "Blood pressure panel with all children optional",
                  },
                ],
                text: "Blood Pressure",
              },
              subject: {
                reference: "Patient/patient-maria-santos",
                display: "Maria Santos",
              },
              encounter: {
                reference: "Encounter/encounter-001",
              },
              effectiveDateTime: "2024-01-15T10:05:00-05:00",
              issued: "2024-01-15T10:10:00-05:00",
              performer: [
                {
                  reference: "Practitioner/practitioner-nurse-williams",
                  display: "Nurse Sarah Williams, RN",
                },
              ],
              interpretation: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                      code: "H",
                      display: "High",
                    },
                  ],
                  text: "Elevated - Stage 2 Hypertension",
                },
              ],
              bodySite: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "368209003",
                    display: "Right upper arm structure",
                  },
                ],
              },
              component: [
                {
                  code: {
                    coding: [
                      {
                        system: "http://loinc.org",
                        code: "8480-6",
                        display: "Systolic blood pressure",
                      },
                    ],
                    text: "Systolic Blood Pressure",
                  },
                  valueQuantity: {
                    value: 148,
                    unit: "mmHg",
                    system: "http://unitsofmeasure.org",
                    code: "mm[Hg]",
                  },
                  interpretation: [
                    {
                      coding: [
                        {
                          system:
                            "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                          code: "H",
                          display: "High",
                        },
                      ],
                    },
                  ],
                  referenceRange: [
                    {
                      high: {
                        value: 120,
                        unit: "mmHg",
                        system: "http://unitsofmeasure.org",
                        code: "mm[Hg]",
                      },
                      text: "Normal: <120 mmHg",
                    },
                  ],
                },
                {
                  code: {
                    coding: [
                      {
                        system: "http://loinc.org",
                        code: "8462-4",
                        display: "Diastolic blood pressure",
                      },
                    ],
                    text: "Diastolic Blood Pressure",
                  },
                  valueQuantity: {
                    value: 92,
                    unit: "mmHg",
                    system: "http://unitsofmeasure.org",
                    code: "mm[Hg]",
                  },
                  interpretation: [
                    {
                      coding: [
                        {
                          system:
                            "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                          code: "H",
                          display: "High",
                        },
                      ],
                    },
                  ],
                  referenceRange: [
                    {
                      high: {
                        value: 80,
                        unit: "mmHg",
                        system: "http://unitsofmeasure.org",
                        code: "mm[Hg]",
                      },
                      text: "Normal: <80 mmHg",
                    },
                  ],
                },
              ],
              note: [
                {
                  text: "Blood pressure measured during initial triage for patient presenting with chest discomfort and shortness of breath. Reading of 148/92 mmHg indicates Stage 2 Hypertension. This finding, combined with patient's presenting symptoms, supports cardiovascular evaluation and led to diagnosis of Essential Hypertension.",
                },
              ],
            },
          },
          {
            fullUrl: "urn:uuid:observation-001",
            resource: {
              resourceType: "Observation",
              id: "observation-001",
              meta: {
                versionId: "1",
                lastUpdated: "2024-01-15T11:30:00Z",
                profile: [
                  "http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-lab",
                ],
              },
              identifier: [
                {
                  use: "official",
                  system: "http://citygeneralhospital.org/lab-results",
                  value: "LAB-2024-789456-1",
                },
              ],
              basedOn: [
                {
                  reference: "ServiceRequest/servicerequest-001",
                },
              ],
              status: "final",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/observation-category",
                      code: "laboratory",
                      display: "Laboratory",
                    },
                  ],
                },
              ],
              code: {
                coding: [
                  {
                    system: "http://loinc.org",
                    code: "2089-1",
                    display:
                      "Cholesterol in LDL [Mass/volume] in Serum or Plasma",
                  },
                ],
                text: "LDL Cholesterol",
              },
              subject: {
                reference: "Patient/patient-maria-santos",
                display: "Maria Santos",
              },
              encounter: {
                reference: "Encounter/encounter-001",
              },
              effectiveDateTime: "2024-01-15T11:15:00-05:00",
              issued: "2024-01-15T11:30:00-05:00",
              performer: [
                {
                  reference: "Organization/organization-city-general-lab",
                  display: "City General Hospital Laboratory",
                },
              ],
              valueQuantity: {
                value: 168,
                unit: "mg/dL",
                system: "http://unitsofmeasure.org",
                code: "mg/dL",
              },
              interpretation: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                      code: "H",
                      display: "High",
                    },
                  ],
                },
              ],
              referenceRange: [
                {
                  low: {
                    value: 0,
                    unit: "mg/dL",
                    system: "http://unitsofmeasure.org",
                    code: "mg/dL",
                  },
                  high: {
                    value: 100,
                    unit: "mg/dL",
                    system: "http://unitsofmeasure.org",
                    code: "mg/dL",
                  },
                  text: "Optimal: <100 mg/dL",
                },
              ],
              note: [
                {
                  text: "Elevated LDL cholesterol ordered to evaluate cardiovascular risk in patient presenting with chest discomfort and shortness of breath. Result of 168 mg/dL (goal <100) supports diagnosis of Hyperlipidemia contributing to cardiovascular risk profile.",
                },
              ],
            },
          },
        ],
      },
    },

    // =========================================
    // 5. CONDITION
    // =========================================
    {
      id: "condition",
      icon: "🩺",
      stepNumber: 5,
      title: "Condition & Diagnosis",
      story: {
        title: "The Diagnosis",
        content: `
                    <p>Dr. Chen reviews all the findings with Maria. The elevated blood pressure readings (consistently above 140/90), combined with the abnormal lipid panel, point to a clear diagnosis.</p>
                    <p><em>"Maria, based on your blood pressure readings and lab results, I'm diagnosing you with <strong>Essential Hypertension</strong> and <strong>Hyperlipidemia</strong>. The good news is these conditions are very manageable with lifestyle changes and medication."</em></p>
                    <p>Dr. Chen enters the diagnoses into Maria's medical record, creating formal <strong>Condition</strong> resources that will be part of her ongoing problem list.</p>
                    <div class="highlight-box">
                        <div class="highlight-box-title">🔍 Clinical Significance</div>
                        <p>A diagnosis becomes part of the patient's permanent medical record and influences all future care decisions, drug interactions, and treatment plans.</p>
                    </div>
                `,
      },
      workflow: {
        title: "Healthcare Workflow: Problem Lists",
        content: `
                    <p>In healthcare, <strong>conditions</strong> (also called problems or diagnoses) are tracked across multiple dimensions:</p>
                    <ul>
                        <li><strong>Problem List:</strong> Active, chronic conditions requiring ongoing attention</li>
                        <li><strong>Encounter Diagnosis:</strong> Conditions addressed during a specific visit</li>
                        <li><strong>Health Concerns:</strong> Patient-reported issues or concerns</li>
                        <li><strong>Billing Diagnosis:</strong> Coded diagnoses for reimbursement (ICD-10)</li>
                    </ul>
                    <p>Conditions have clinical status (active, resolved, remission) and verification status (confirmed, provisional, differential).</p>
                `,
      },
      fhirExplanation: {
        title: "FHIR Resource: Condition",
        content: `
                    <p>The <strong>Condition</strong> resource represents a clinical condition, problem, diagnosis, or health concern. It tracks both the diagnosis and its progression over time.</p>
                    <div class="field-list">
                        <div class="field-item">
                            <span class="field-name">clinicalStatus</span>
                            <span class="field-description">Status: active | recurrence | relapse | inactive | remission | resolved</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">verificationStatus</span>
                            <span class="field-description">Certainty: unconfirmed | provisional | differential | confirmed | refuted</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">category</span>
                            <span class="field-description">Type: problem-list-item | encounter-diagnosis | health-concern</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">severity</span>
                            <span class="field-description">Severity level: mild | moderate | severe</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">code</span>
                            <span class="field-description">The condition diagnosis (ICD-10, SNOMED CT)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">subject</span>
                            <span class="field-description">Reference to the Patient</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">onsetDateTime</span>
                            <span class="field-description">When the condition began</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">recordedDate</span>
                            <span class="field-description">When the condition was documented</span>
                        </div>
                    </div>
                `,
      },
      fhirResource: {
        resourceType: "Bundle",
        id: "bundle-conditions-maria",
        type: "collection",
        entry: [
          {
            fullUrl: "urn:uuid:condition-001",
            resource: {
              resourceType: "Condition",
              id: "condition-001",
              meta: {
                versionId: "1",
                lastUpdated: "2024-01-15T11:40:00Z",
                profile: [
                  "http://hl7.org/fhir/us/core/StructureDefinition/us-core-condition",
                ],
              },
              clinicalStatus: {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/condition-clinical",
                    code: "active",
                    display: "Active",
                  },
                ],
              },
              verificationStatus: {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/condition-ver-status",
                    code: "confirmed",
                    display: "Confirmed",
                  },
                ],
              },
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "problem-list-item",
                      display: "Problem List Item",
                    },
                  ],
                },
              ],
              severity: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "Moderate",
                  },
                ],
              },
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "59621000",
                    display: "Essential hypertension",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "I10",
                    display: "Essential (primary) hypertension",
                  },
                ],
                text: "Essential Hypertension",
              },
              subject: {
                reference: "Patient/patient-maria-santos",
                display: "Maria Santos",
              },
              encounter: {
                reference: "Encounter/encounter-001",
              },
              onsetDateTime: "2024-01-15",
              recordedDate: "2024-01-15T11:40:00-05:00",
              recorder: {
                reference: "Practitioner/practitioner-dr-chen",
                display: "Dr. Sarah Chen, MD",
              },
              asserter: {
                reference: "Practitioner/practitioner-dr-chen",
                display: "Dr. Sarah Chen, MD",
              },
              evidence: [
                {
                  code: [
                    {
                      coding: [
                        {
                          system: "http://snomed.info/sct",
                          code: "29857009",
                          display: "Chest pain",
                        },
                      ],
                      text: "Presenting symptom: Chest discomfort with exertion",
                    },
                  ],
                  detail: [
                    {
                      reference: "Observation/observation-bp-001",
                      display: "Blood Pressure 148/92 mmHg",
                    },
                  ],
                },
              ],
              note: [
                {
                  text: "Patient presents with chest discomfort and shortness of breath. Blood pressure consistently elevated on multiple readings (148/92 mmHg). Contributing factors include family history, elevated lipids, and sedentary lifestyle. Plan to start Lisinopril and lifestyle modifications.",
                },
              ],
            },
          },
          {
            fullUrl: "urn:uuid:condition-002",
            resource: {
              resourceType: "Condition",
              id: "condition-002",
              meta: {
                versionId: "1",
                lastUpdated: "2024-01-15T11:42:00Z",
                profile: [
                  "http://hl7.org/fhir/us/core/StructureDefinition/us-core-condition",
                ],
              },
              clinicalStatus: {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/condition-clinical",
                    code: "active",
                    display: "Active",
                  },
                ],
              },
              verificationStatus: {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/condition-ver-status",
                    code: "confirmed",
                    display: "Confirmed",
                  },
                ],
              },
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/condition-category",
                      code: "problem-list-item",
                      display: "Problem List Item",
                    },
                  ],
                },
              ],
              severity: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "6736007",
                    display: "Moderate",
                  },
                ],
              },
              code: {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "55822004",
                    display: "Hyperlipidemia",
                  },
                  {
                    system: "http://hl7.org/fhir/sid/icd-10-cm",
                    code: "E78.5",
                    display: "Hyperlipidemia, unspecified",
                  },
                ],
                text: "Hyperlipidemia",
              },
              subject: {
                reference: "Patient/patient-maria-santos",
                display: "Maria Santos",
              },
              encounter: {
                reference: "Encounter/encounter-001",
              },
              onsetDateTime: "2024-01-15",
              recordedDate: "2024-01-15T11:42:00-05:00",
              recorder: {
                reference: "Practitioner/practitioner-dr-chen",
                display: "Dr. Sarah Chen, MD",
              },
              asserter: {
                reference: "Practitioner/practitioner-dr-chen",
                display: "Dr. Sarah Chen, MD",
              },
              evidence: [
                {
                  code: [
                    {
                      coding: [
                        {
                          system: "http://snomed.info/sct",
                          code: "29857009",
                          display: "Chest pain",
                        },
                      ],
                      text: "Presenting symptom: Chest discomfort - cardiovascular risk evaluation",
                    },
                  ],
                  detail: [
                    {
                      reference: "Observation/observation-001",
                      display: "LDL Cholesterol 168 mg/dL (High)",
                    },
                  ],
                },
              ],
              note: [
                {
                  text: "Identified during cardiovascular workup for chest discomfort. LDL elevated at 168 mg/dL, HDL low at 45 mg/dL. Combined with hypertension, represents significant cardiovascular risk. Plan to start Atorvastatin and dietary modifications.",
                },
              ],
            },
          },
        ],
      },
    },

    // =========================================
    // 6. ALLERGY INTOLERANCE
    // =========================================
    {
      id: "allergy",
      icon: "⚠️",
      stepNumber: 6,
      title: "AllergyIntolerance",
      story: {
        title: "Checking for Allergies",
        content: `
                    <p>Before prescribing any medications, Dr. Chen asks Maria about known allergies. Maria recalls: <em>"I had a bad reaction to penicillin when I was a teenager. I broke out in hives all over my body."</em></p>
                    <p>Dr. Chen documents this as a <strong>confirmed drug allergy</strong> in Maria's chart. This information is critical – it will trigger automatic alerts in the prescribing system to prevent accidental exposure to penicillin or related antibiotics.</p>
                    <div class="highlight-box">
                        <div class="highlight-box-title">⚠️ Patient Safety</div>
                        <p>Allergy documentation is a cornerstone of medication safety. Proper FHIR allergy recording enables clinical decision support systems to alert providers across all care settings.</p>
                    </div>
                `,
      },
      workflow: {
        title: "Healthcare Workflow: Allergy Management",
        content: `
                    <p>Allergy and intolerance management is critical for patient safety:</p>
                    <ul>
                        <li><strong>Allergy:</strong> Immune-mediated reaction (e.g., hives, anaphylaxis)</li>
                        <li><strong>Intolerance:</strong> Non-immune adverse reaction (e.g., GI upset)</li>
                    </ul>
                    <p>Healthcare systems use allergies for:</p>
                    <ol>
                        <li><strong>Medication Alerts:</strong> Warn when prescribing similar drugs</li>
                        <li><strong>Cross-Reactivity:</strong> Flag related drug classes</li>
                        <li><strong>Wristbands/Charts:</strong> Visual warnings during care</li>
                        <li><strong>Emergency Access:</strong> Quick reference in emergencies</li>
                    </ol>
                `,
      },
      fhirExplanation: {
        title: "FHIR Resource: AllergyIntolerance",
        content: `
                    <p>The <strong>AllergyIntolerance</strong> resource records the risk of adverse reactions to substances. It distinguishes between true allergies and intolerances.</p>
                    <div class="field-list">
                        <div class="field-item">
                            <span class="field-name">clinicalStatus</span>
                            <span class="field-description">Status: active | inactive | resolved</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">verificationStatus</span>
                            <span class="field-description">Certainty: unconfirmed | confirmed | refuted | entered-in-error</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">type</span>
                            <span class="field-description">Type: allergy | intolerance</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">category</span>
                            <span class="field-description">Category: food | medication | environment | biologic</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">criticality</span>
                            <span class="field-description">Potential severity: low | high | unable-to-assess</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">code</span>
                            <span class="field-description">The allergen (RxNorm, SNOMED, NDF-RT)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">reaction</span>
                            <span class="field-description">Details of past reactions (manifestation, severity, onset)</span>
                        </div>
                    </div>
                `,
      },
      fhirResource: {
        resourceType: "AllergyIntolerance",
        id: "allergyintolerance-001",
        meta: {
          versionId: "1",
          lastUpdated: "2024-01-15T10:30:00Z",
          profile: [
            "http://hl7.org/fhir/us/core/StructureDefinition/us-core-allergyintolerance",
          ],
        },
        clinicalStatus: {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
              code: "active",
              display: "Active",
            },
          ],
        },
        verificationStatus: {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
              code: "confirmed",
              display: "Confirmed",
            },
          ],
        },
        type: "allergy",
        category: ["medication"],
        criticality: "high",
        code: {
          coding: [
            {
              system: "http://www.nlm.nih.gov/research/umls/rxnorm",
              code: "7984",
              display: "Penicillin G",
            },
            {
              system: "http://snomed.info/sct",
              code: "764146007",
              display: "Penicillin",
            },
          ],
          text: "Penicillin",
        },
        patient: {
          reference: "Patient/patient-maria-santos",
          display: "Maria Santos",
        },
        encounter: {
          reference: "Encounter/encounter-001",
        },
        onsetDateTime: "1994-01-01",
        recordedDate: "2024-01-15T10:30:00-05:00",
        recorder: {
          reference: "Practitioner/practitioner-dr-chen",
          display: "Dr. Sarah Chen, MD",
        },
        asserter: {
          reference: "Patient/patient-maria-santos",
          display: "Maria Santos",
        },
        lastOccurrence: "1994-01-01",
        reaction: [
          {
            substance: {
              coding: [
                {
                  system: "http://www.nlm.nih.gov/research/umls/rxnorm",
                  code: "7984",
                  display: "Penicillin G",
                },
              ],
            },
            manifestation: [
              {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "126485001",
                    display: "Urticaria",
                  },
                ],
                text: "Hives/Urticaria",
              },
            ],
            description:
              "Patient developed widespread hives within 2 hours of taking penicillin. No respiratory distress or anaphylaxis reported.",
            onset: "1994-01-01",
            severity: "moderate",
            exposureRoute: {
              coding: [
                {
                  system: "http://snomed.info/sct",
                  code: "26643006",
                  display: "Oral route",
                },
              ],
            },
          },
        ],
        note: [
          {
            text: "Patient reports teenage reaction to penicillin. Should avoid all penicillin-class antibiotics and use caution with cephalosporins due to cross-reactivity risk.",
          },
        ],
      },
    },

    // =========================================
    // 7. MEDICATION
    // =========================================
    {
      id: "medication",
      icon: "💊",
      stepNumber: 7,
      title: "Medication Workflow",
      story: {
        title: "The Treatment Plan",
        content: `
                    <p>Dr. Chen discusses the treatment plan with Maria: <em>"Given your blood pressure and cholesterol levels, I'm going to start you on two medications. First, Lisinopril 10mg once daily for blood pressure. Second, Atorvastatin 20mg once daily for cholesterol."</em></p>
                    <p>Dr. Chen checks the system – no alerts for drug interactions with Maria's penicillin allergy. The prescriptions are sent electronically to Maria's preferred pharmacy.</p>
                    <p><em>"Take both medications in the evening with dinner. You might feel a bit dizzy at first as your body adjusts to the blood pressure medication. Call us if you develop a persistent dry cough – that's a known side effect we should monitor."</em></p>
                `,
      },
      workflow: {
        title: "Healthcare Workflow: Medication Management",
        content: `
                    <p>Medication management in FHIR involves multiple interconnected resources:</p>
                    <ul>
                        <li><strong>Medication:</strong> The drug product itself (name, form, ingredients)</li>
                        <li><strong>MedicationRequest:</strong> The prescription/order from the provider</li>
                        <li><strong>MedicationDispense:</strong> Pharmacy filling the prescription</li>
                        <li><strong>MedicationAdministration:</strong> Actual giving of medication (hospital setting)</li>
                        <li><strong>MedicationStatement:</strong> Patient's report of taking medication</li>
                    </ul>
                    <div class="highlight-box teal">
                        <div class="highlight-box-title">📋 Medication Lifecycle</div>
                        <p>Request → Dispense → Administer → Record Statement</p>
                    </div>
                `,
      },
      fhirExplanation: {
        title: "FHIR Resources: Medication & MedicationRequest",
        content: `
                    <p><strong>Medication</strong> describes what the medication is. <strong>MedicationRequest</strong> describes the order/prescription for it.</p>
                    <div class="field-list">
                        <div class="field-item">
                            <span class="field-name">status</span>
                            <span class="field-description">Request state: active | on-hold | cancelled | completed | stopped</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">intent</span>
                            <span class="field-description">Type: proposal | plan | order | original-order | reflex-order</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">medication[x]</span>
                            <span class="field-description">The medication (reference or CodeableConcept)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">subject</span>
                            <span class="field-description">Reference to the Patient</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">dosageInstruction</span>
                            <span class="field-description">How the medication should be taken (timing, route, dose)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">dispenseRequest</span>
                            <span class="field-description">Dispensing details (quantity, refills, expected supply)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">substitution</span>
                            <span class="field-description">Whether generic substitution is allowed</span>
                        </div>
                    </div>
                `,
      },
      fhirResource: {
        resourceType: "Bundle",
        id: "bundle-medications-maria",
        type: "collection",
        entry: [
          {
            fullUrl: "urn:uuid:medicationrequest-001",
            resource: {
              resourceType: "MedicationRequest",
              id: "medicationrequest-001",
              meta: {
                versionId: "1",
                lastUpdated: "2024-01-15T11:45:00Z",
                profile: [
                  "http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest",
                ],
              },
              identifier: [
                {
                  use: "official",
                  system: "http://citygeneralhospital.org/prescriptions",
                  value: "RX-2024-789123",
                },
              ],
              status: "active",
              intent: "order",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                      code: "community",
                      display: "Community",
                    },
                  ],
                },
              ],
              priority: "routine",
              medicationCodeableConcept: {
                coding: [
                  {
                    system: "http://www.nlm.nih.gov/research/umls/rxnorm",
                    code: "314076",
                    display: "Lisinopril 10 MG Oral Tablet",
                  },
                ],
                text: "Lisinopril 10mg tablet",
              },
              subject: {
                reference: "Patient/patient-maria-santos",
                display: "Maria Santos",
              },
              encounter: {
                reference: "Encounter/encounter-001",
              },
              supportingInformation: [
                {
                  reference: "Observation/observation-bp-001",
                  display:
                    "Blood Pressure 148/92 mmHg - supporting evidence for hypertension diagnosis",
                },
              ],
              authoredOn: "2024-01-15T11:45:00-05:00",
              requester: {
                reference: "Practitioner/practitioner-dr-chen",
                display: "Dr. Sarah Chen, MD",
              },
              reasonCode: [
                {
                  coding: [
                    {
                      system: "http://snomed.info/sct",
                      code: "59621000",
                      display: "Essential hypertension",
                    },
                  ],
                  text: "Treatment for Essential Hypertension diagnosed during evaluation of chest discomfort",
                },
              ],
              reasonReference: [
                {
                  reference: "Condition/condition-001",
                  display: "Essential Hypertension",
                },
              ],
              courseOfTherapyType: {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
                    code: "continuous",
                    display: "Continuous long term therapy",
                  },
                ],
              },
              dosageInstruction: [
                {
                  sequence: 1,
                  text: "Take 1 tablet by mouth once daily in the evening",
                  additionalInstruction: [
                    {
                      coding: [
                        {
                          system: "http://snomed.info/sct",
                          code: "311504000",
                          display: "With or after food",
                        },
                      ],
                    },
                  ],
                  timing: {
                    repeat: {
                      frequency: 1,
                      period: 1,
                      periodUnit: "d",
                      when: ["EVE"],
                    },
                  },
                  route: {
                    coding: [
                      {
                        system: "http://snomed.info/sct",
                        code: "26643006",
                        display: "Oral route",
                      },
                    ],
                  },
                  doseAndRate: [
                    {
                      type: {
                        coding: [
                          {
                            system:
                              "http://terminology.hl7.org/CodeSystem/dose-rate-type",
                            code: "ordered",
                            display: "Ordered",
                          },
                        ],
                      },
                      doseQuantity: {
                        value: 1,
                        unit: "tablet",
                        system:
                          "http://terminology.hl7.org/CodeSystem/v3-orderableDrugForm",
                        code: "TAB",
                      },
                    },
                  ],
                },
              ],
              dispenseRequest: {
                numberOfRepeatsAllowed: 3,
                quantity: {
                  value: 30,
                  unit: "tablets",
                  system:
                    "http://terminology.hl7.org/CodeSystem/v3-orderableDrugForm",
                  code: "TAB",
                },
                expectedSupplyDuration: {
                  value: 30,
                  unit: "days",
                  system: "http://unitsofmeasure.org",
                  code: "d",
                },
              },
              substitution: {
                allowedBoolean: true,
                reason: {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/v3-ActReason",
                      code: "CT",
                      display: "Continuing therapy",
                    },
                  ],
                },
              },
              note: [
                {
                  text: "Prescribed to treat Essential Hypertension diagnosed during cardiovascular workup for chest discomfort. Patient's BP was 148/92 mmHg. Monitor for dry cough side effect.",
                },
              ],
            },
          },
          {
            fullUrl: "urn:uuid:medicationrequest-002",
            resource: {
              resourceType: "MedicationRequest",
              id: "medicationrequest-002",
              meta: {
                versionId: "1",
                lastUpdated: "2024-01-15T11:47:00Z",
                profile: [
                  "http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest",
                ],
              },
              identifier: [
                {
                  use: "official",
                  system: "http://citygeneralhospital.org/prescriptions",
                  value: "RX-2024-789124",
                },
              ],
              status: "active",
              intent: "order",
              category: [
                {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
                      code: "community",
                      display: "Community",
                    },
                  ],
                },
              ],
              priority: "routine",
              medicationCodeableConcept: {
                coding: [
                  {
                    system: "http://www.nlm.nih.gov/research/umls/rxnorm",
                    code: "617312",
                    display: "Atorvastatin 20 MG Oral Tablet",
                  },
                ],
                text: "Atorvastatin 20mg tablet",
              },
              subject: {
                reference: "Patient/patient-maria-santos",
                display: "Maria Santos",
              },
              encounter: {
                reference: "Encounter/encounter-001",
              },
              supportingInformation: [
                {
                  reference: "Observation/observation-001",
                  display:
                    "LDL Cholesterol 168 mg/dL - supporting evidence for hyperlipidemia diagnosis",
                },
              ],
              authoredOn: "2024-01-15T11:47:00-05:00",
              requester: {
                reference: "Practitioner/practitioner-dr-chen",
                display: "Dr. Sarah Chen, MD",
              },
              reasonCode: [
                {
                  coding: [
                    {
                      system: "http://snomed.info/sct",
                      code: "55822004",
                      display: "Hyperlipidemia",
                    },
                  ],
                  text: "Treatment for Hyperlipidemia diagnosed during cardiovascular evaluation",
                },
              ],
              reasonReference: [
                {
                  reference: "Condition/condition-002",
                  display: "Hyperlipidemia",
                },
              ],
              courseOfTherapyType: {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy",
                    code: "continuous",
                    display: "Continuous long term therapy",
                  },
                ],
              },
              dosageInstruction: [
                {
                  sequence: 1,
                  text: "Take 1 tablet by mouth once daily in the evening",
                  additionalInstruction: [
                    {
                      coding: [
                        {
                          system: "http://snomed.info/sct",
                          code: "311504000",
                          display: "With or after food",
                        },
                      ],
                    },
                  ],
                  timing: {
                    repeat: {
                      frequency: 1,
                      period: 1,
                      periodUnit: "d",
                      when: ["EVE"],
                    },
                  },
                  route: {
                    coding: [
                      {
                        system: "http://snomed.info/sct",
                        code: "26643006",
                        display: "Oral route",
                      },
                    ],
                  },
                  doseAndRate: [
                    {
                      type: {
                        coding: [
                          {
                            system:
                              "http://terminology.hl7.org/CodeSystem/dose-rate-type",
                            code: "ordered",
                            display: "Ordered",
                          },
                        ],
                      },
                      doseQuantity: {
                        value: 1,
                        unit: "tablet",
                        system:
                          "http://terminology.hl7.org/CodeSystem/v3-orderableDrugForm",
                        code: "TAB",
                      },
                    },
                  ],
                },
              ],
              dispenseRequest: {
                numberOfRepeatsAllowed: 3,
                quantity: {
                  value: 30,
                  unit: "tablets",
                  system:
                    "http://terminology.hl7.org/CodeSystem/v3-orderableDrugForm",
                  code: "TAB",
                },
                expectedSupplyDuration: {
                  value: 30,
                  unit: "days",
                  system: "http://unitsofmeasure.org",
                  code: "d",
                },
              },
              substitution: {
                allowedBoolean: true,
                reason: {
                  coding: [
                    {
                      system:
                        "http://terminology.hl7.org/CodeSystem/v3-ActReason",
                      code: "CT",
                      display: "Continuing therapy",
                    },
                  ],
                },
              },
              note: [
                {
                  text: "Prescribed to treat Hyperlipidemia (LDL 168 mg/dL, goal <100) discovered during cardiovascular workup for chest discomfort. To be taken with Lisinopril. Follow-up lipid panel in 3 months.",
                },
              ],
            },
          },
        ],
      },
    },

    // =========================================
    // 8. PROCEDURE
    // =========================================
    {
      id: "procedure",
      icon: "🔧",
      stepNumber: 8,
      title: "Procedure",
      story: {
        title: "The ECG Procedure",
        content: `
                    <p>As part of Maria's cardiac workup, the medical assistant performs a <strong>12-lead electrocardiogram (ECG)</strong>. Maria lies on the examination table while small adhesive electrodes are placed on her chest, arms, and legs.</p>
                    <p>The ECG takes about 5 minutes. The tracing shows:</p>
                    <ul>
                        <li><strong>Normal sinus rhythm</strong> at 76 beats per minute</li>
                        <li><strong>No ST-segment changes</strong> (ruling out acute ischemia)</li>
                        <li><strong>Mild left ventricular hypertrophy</strong> (consistent with hypertension)</li>
                    </ul>
                    <p>Dr. Chen reviews the results: <em>"Your heart rhythm looks good, Maria. There's a slight thickening of your heart muscle which is common with high blood pressure. This should improve as we get your blood pressure under control."</em></p>
                `,
      },
      workflow: {
        title: "Healthcare Workflow: Procedures",
        content: `
                    <p><strong>Procedures</strong> represent clinical actions performed on or for a patient. They range from simple diagnostic tests to complex surgeries:</p>
                    <ul>
                        <li><strong>Diagnostic:</strong> ECG, X-ray, MRI, blood draw</li>
                        <li><strong>Therapeutic:</strong> Surgery, physical therapy, wound care</li>
                        <li><strong>Administrative:</strong> Counseling, education, care planning</li>
                    </ul>
                    <p>Procedures are typically initiated by a <strong>ServiceRequest</strong> and may generate <strong>DiagnosticReports</strong> and <strong>Observations</strong> as results.</p>
                `,
      },
      fhirExplanation: {
        title: "FHIR Resource: Procedure",
        content: `
                    <p>The <strong>Procedure</strong> resource details an activity performed on, with, or for a patient. It captures what was done, by whom, and the outcome.</p>
                    <div class="field-list">
                        <div class="field-item">
                            <span class="field-name">status</span>
                            <span class="field-description">State: preparation | in-progress | not-done | on-hold | stopped | completed</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">category</span>
                            <span class="field-description">Classification of procedure type</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">code</span>
                            <span class="field-description">The procedure performed (CPT, SNOMED, ICD-10-PCS)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">subject</span>
                            <span class="field-description">Reference to the Patient</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">performedDateTime</span>
                            <span class="field-description">When the procedure was performed</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">performer</span>
                            <span class="field-description">Who performed the procedure</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">reasonReference</span>
                            <span class="field-description">Why the procedure was performed (links to Condition)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">outcome</span>
                            <span class="field-description">Result of the procedure</span>
                        </div>
                    </div>
                `,
      },
      fhirResource: {
        resourceType: "Procedure",
        id: "procedure-001",
        meta: {
          versionId: "1",
          lastUpdated: "2024-01-15T10:55:00Z",
          profile: [
            "http://hl7.org/fhir/us/core/StructureDefinition/us-core-procedure",
          ],
        },
        identifier: [
          {
            use: "official",
            system: "http://citygeneralhospital.org/procedures",
            value: "PROC-2024-456789",
          },
        ],
        basedOn: [
          {
            reference: "ServiceRequest/servicerequest-002",
          },
        ],
        status: "completed",
        category: {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: "103693007",
              display: "Diagnostic procedure",
            },
          ],
        },
        code: {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: "29303009",
              display: "Electrocardiographic procedure",
            },
            {
              system: "http://www.ama-assn.org/go/cpt",
              code: "93000",
              display: "Electrocardiogram, routine ECG with at least 12 leads",
            },
          ],
          text: "12-lead Electrocardiogram (ECG)",
        },
        subject: {
          reference: "Patient/patient-maria-santos",
          display: "Maria Santos",
        },
        encounter: {
          reference: "Encounter/encounter-001",
        },
        performedDateTime: "2024-01-15T10:50:00-05:00",
        recorder: {
          reference: "Practitioner/practitioner-dr-chen",
          display: "Dr. Sarah Chen, MD",
        },
        asserter: {
          reference: "Practitioner/practitioner-dr-chen",
          display: "Dr. Sarah Chen, MD",
        },
        performer: [
          {
            function: {
              coding: [
                {
                  system: "http://snomed.info/sct",
                  code: "224608005",
                  display: "Administrative healthcare staff",
                },
              ],
            },
            actor: {
              reference: "Practitioner/practitioner-ma-johnson",
              display: "Medical Assistant Johnson",
            },
            onBehalfOf: {
              reference: "Organization/organization-city-general",
              display: "City General Hospital",
            },
          },
        ],
        location: {
          reference: "Location/location-exam-room-3",
          display: "Examination Room 3",
        },
        reasonCode: [
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "29857009",
                display: "Chest pain",
              },
            ],
            text: "Cardiac evaluation for chest symptoms",
          },
        ],
        reasonReference: [
          {
            reference: "Condition/condition-001",
            display: "Essential Hypertension",
          },
        ],
        bodySite: [
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "80891009",
                display: "Heart structure",
              },
            ],
          },
        ],
        outcome: {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: "385669000",
              display: "Successful",
            },
          ],
        },
        report: [
          {
            reference: "DiagnosticReport/diagnosticreport-001",
            display: "ECG Report",
          },
        ],
        note: [
          {
            text: "12-lead ECG performed without complications. Patient tolerated procedure well.",
          },
        ],
      },
    },

    // =========================================
    // 9. DIAGNOSTIC REPORT
    // =========================================
    {
      id: "diagnostic-report",
      icon: "📊",
      stepNumber: 9,
      title: "DiagnosticReport",
      story: {
        title: "The Complete Picture",
        content: `
                    <p>Dr. Chen reviews all of Maria's test results together in a comprehensive <strong>Diagnostic Report</strong>. This report consolidates:</p>
                    <ul>
                        <li><strong>ECG findings:</strong> Normal sinus rhythm, mild LVH</li>
                        <li><strong>Laboratory results:</strong> Elevated LDL, low HDL, borderline triglycerides</li>
                        <li><strong>Clinical interpretation:</strong> Cardiovascular risk requiring intervention</li>
                    </ul>
                    <p>The report is finalized and becomes part of Maria's permanent medical record. It will be shared with any specialists Maria might see in the future, ensuring continuity of care.</p>
                `,
      },
      workflow: {
        title: "Healthcare Workflow: Results Reporting",
        content: `
                    <p><strong>DiagnosticReports</strong> are the primary way clinical results are communicated:</p>
                    <ul>
                        <li><strong>Laboratory Reports:</strong> Bundle multiple test results with interpretation</li>
                        <li><strong>Radiology Reports:</strong> Imaging findings with radiologist impression</li>
                        <li><strong>Pathology Reports:</strong> Tissue analysis results</li>
                        <li><strong>Cardiology Reports:</strong> ECG, echocardiogram interpretations</li>
                    </ul>
                    <p>Reports link back to the original <strong>ServiceRequest</strong> and contain <strong>Observations</strong> for individual measurements.</p>
                `,
      },
      fhirExplanation: {
        title: "FHIR Resource: DiagnosticReport",
        content: `
                    <p>The <strong>DiagnosticReport</strong> resource presents the findings and interpretation of diagnostic tests. It serves as a container that references related Observations.</p>
                    <div class="field-list">
                        <div class="field-item">
                            <span class="field-name">status</span>
                            <span class="field-description">State: registered | partial | preliminary | final | amended | cancelled</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">category</span>
                            <span class="field-description">Service category (LAB, RAD, cardiology)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">code</span>
                            <span class="field-description">Type of report (LOINC)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">subject</span>
                            <span class="field-description">Reference to the Patient</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">effectiveDateTime</span>
                            <span class="field-description">Time of the diagnostic procedure</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">result</span>
                            <span class="field-description">References to Observation resources</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">conclusion</span>
                            <span class="field-description">Clinical interpretation text</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">conclusionCode</span>
                            <span class="field-description">Coded diagnoses from the report</span>
                        </div>
                    </div>
                `,
      },
      fhirResource: {
        resourceType: "DiagnosticReport",
        id: "diagnosticreport-001",
        meta: {
          versionId: "1",
          lastUpdated: "2024-01-15T11:35:00Z",
          profile: [
            "http://hl7.org/fhir/us/core/StructureDefinition/us-core-diagnosticreport-lab",
          ],
        },
        identifier: [
          {
            use: "official",
            system: "http://citygeneralhospital.org/reports",
            value: "RPT-2024-789456",
          },
        ],
        basedOn: [
          {
            reference: "ServiceRequest/servicerequest-001",
          },
        ],
        status: "final",
        category: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/v2-0074",
                code: "LAB",
                display: "Laboratory",
              },
              {
                system: "http://loinc.org",
                code: "LP29684-5",
                display: "Radiology",
              },
            ],
          },
        ],
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: "57698-3",
              display: "Lipid panel with direct LDL - Serum or Plasma",
            },
          ],
          text: "Lipid Panel with Cardiac Assessment",
        },
        subject: {
          reference: "Patient/patient-maria-santos",
          display: "Maria Santos",
        },
        encounter: {
          reference: "Encounter/encounter-001",
        },
        effectiveDateTime: "2024-01-15T11:15:00-05:00",
        issued: "2024-01-15T11:35:00-05:00",
        performer: [
          {
            reference: "Organization/organization-city-general-lab",
            display: "City General Hospital Laboratory",
          },
        ],
        resultsInterpreter: [
          {
            reference: "Practitioner/practitioner-dr-chen",
            display: "Dr. Sarah Chen, MD",
          },
        ],
        result: [
          {
            reference: "Observation/observation-001",
            display: "LDL Cholesterol: 168 mg/dL (High)",
          },
          {
            reference: "Observation/observation-002",
            display: "HDL Cholesterol: 45 mg/dL (Low)",
          },
          {
            reference: "Observation/observation-003",
            display: "Total Cholesterol: 248 mg/dL (High)",
          },
          {
            reference: "Observation/observation-004",
            display: "Triglycerides: 175 mg/dL (Borderline High)",
          },
        ],
        conclusion:
          "Lipid panel demonstrates atherogenic dyslipidemia with elevated LDL cholesterol (168 mg/dL), low HDL cholesterol (45 mg/dL), and borderline high triglycerides (175 mg/dL). Combined with newly diagnosed hypertension, patient has moderate cardiovascular risk. Recommend lifestyle modifications and initiation of statin therapy. Follow-up lipid panel in 3 months to assess response to treatment.",
        conclusionCode: [
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "55822004",
                display: "Hyperlipidemia",
              },
            ],
          },
        ],
      },
    },

    // =========================================
    // 10. IMMUNIZATION
    // =========================================
    {
      id: "immunization",
      icon: "💉",
      stepNumber: 10,
      title: "Immunization",
      story: {
        title: "Preventive Care",
        content: `
                    <p>Before Maria leaves, Dr. Chen checks her immunization records. <em>"I see you haven't had your flu shot this season. Given your age and the cardiac concerns, I strongly recommend getting vaccinated today. Influenza can be particularly hard on the heart."</em></p>
                    <p>Maria agrees, and the nurse administers the <strong>quadrivalent influenza vaccine</strong>. The immunization is recorded in Maria's chart and reported to the state immunization registry.</p>
                    <div class="highlight-box teal">
                        <div class="highlight-box-title">🛡️ Preventive Medicine</div>
                        <p>Immunizations are a critical part of preventive care. FHIR immunization records enable tracking across providers and automated reminder systems.</p>
                    </div>
                `,
      },
      workflow: {
        title: "Healthcare Workflow: Immunization Management",
        content: `
                    <p>Immunization workflows involve multiple stakeholders and registries:</p>
                    <ol>
                        <li><strong>Eligibility Check:</strong> Review patient's immunization history</li>
                        <li><strong>Clinical Screening:</strong> Check for contraindications</li>
                        <li><strong>Administration:</strong> Give the vaccine, document lot/site</li>
                        <li><strong>Registry Reporting:</strong> Submit to state IIS (Immunization Information System)</li>
                        <li><strong>Patient Education:</strong> Provide VIS (Vaccine Information Statement)</li>
                    </ol>
                `,
      },
      fhirExplanation: {
        title: "FHIR Resource: Immunization",
        content: `
                    <p>The <strong>Immunization</strong> resource records the administration of a vaccine. It captures the vaccine product, administration details, and patient response.</p>
                    <div class="field-list">
                        <div class="field-item">
                            <span class="field-name">status</span>
                            <span class="field-description">State: completed | entered-in-error | not-done</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">vaccineCode</span>
                            <span class="field-description">The vaccine product (CVX code)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">patient</span>
                            <span class="field-description">Reference to the Patient</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">occurrenceDateTime</span>
                            <span class="field-description">When the vaccine was administered</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">lotNumber</span>
                            <span class="field-description">Vaccine lot number for tracking</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">site</span>
                            <span class="field-description">Body site of injection</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">route</span>
                            <span class="field-description">How the vaccine was given (IM, SC, etc.)</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">performer</span>
                            <span class="field-description">Who administered the vaccine</span>
                        </div>
                    </div>
                `,
      },
      fhirResource: {
        resourceType: "Immunization",
        id: "immunization-001",
        meta: {
          versionId: "1",
          lastUpdated: "2024-01-15T11:20:00Z",
          profile: [
            "http://hl7.org/fhir/us/core/StructureDefinition/us-core-immunization",
          ],
        },
        identifier: [
          {
            use: "official",
            system: "http://citygeneralhospital.org/immunizations",
            value: "IMM-2024-456123",
          },
        ],
        status: "completed",
        vaccineCode: {
          coding: [
            {
              system: "http://hl7.org/fhir/sid/cvx",
              code: "197",
              display: "Influenza, high-dose, quadrivalent",
            },
            {
              system: "http://hl7.org/fhir/sid/ndc",
              code: "49281-0422-50",
              display: "FLUZONE HIGH-DOSE QUADRIVALENT",
            },
          ],
          text: "Influenza Vaccine, Quadrivalent, High-Dose",
        },
        patient: {
          reference: "Patient/patient-maria-santos",
          display: "Maria Santos",
        },
        encounter: {
          reference: "Encounter/encounter-001",
        },
        occurrenceDateTime: "2024-01-15T11:15:00-05:00",
        recorded: "2024-01-15T11:20:00-05:00",
        primarySource: true,
        location: {
          reference: "Location/location-exam-room-3",
          display: "Examination Room 3",
        },
        manufacturer: {
          reference: "Organization/organization-sanofi",
          display: "Sanofi Pasteur",
        },
        lotNumber: "UJ456AA",
        expirationDate: "2024-06-30",
        site: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v3-ActSite",
              code: "LA",
              display: "left arm",
            },
          ],
        },
        route: {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/v3-RouteOfAdministration",
              code: "IM",
              display: "Injection, intramuscular",
            },
          ],
        },
        doseQuantity: {
          value: 0.7,
          unit: "mL",
          system: "http://unitsofmeasure.org",
          code: "mL",
        },
        performer: [
          {
            function: {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/v2-0443",
                  code: "AP",
                  display: "Administering Provider",
                },
              ],
            },
            actor: {
              reference: "Practitioner/practitioner-nurse-williams",
              display: "Nurse Sarah Williams, RN",
            },
          },
          {
            function: {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/v2-0443",
                  code: "OP",
                  display: "Ordering Provider",
                },
              ],
            },
            actor: {
              reference: "Practitioner/practitioner-dr-chen",
              display: "Dr. Sarah Chen, MD",
            },
          },
        ],
        note: [
          {
            text: "Patient received high-dose flu vaccine due to age 45+ and newly diagnosed cardiovascular risk factors (Essential Hypertension and Hyperlipidemia). Influenza infection can place additional stress on the cardiovascular system. Observed for 15 minutes post-administration with no adverse reactions. VIS provided.",
          },
        ],
        reasonCode: [
          {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "78648007",
                display: "At risk for infection",
              },
            ],
            text: "Seasonal influenza prevention - patient has cardiovascular risk from hypertension and hyperlipidemia",
          },
        ],
        reasonReference: [
          {
            reference: "Condition/condition-001",
            display: "Essential Hypertension - cardiovascular risk factor",
          },
          {
            reference: "Condition/condition-002",
            display: "Hyperlipidemia - cardiovascular risk factor",
          },
        ],
        isSubpotent: false,
        education: [
          {
            documentType: "Vaccine Information Statement",
            publicationDate: "2023-08-15",
            presentationDate: "2024-01-15",
          },
        ],
        fundingSource: {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/immunization-funding-source",
              code: "private",
              display: "Private",
            },
          ],
        },
      },
    },

    // =========================================
    // 11. LIFECYCLE PATTERNS
    // =========================================
    {
      id: "lifecycle",
      icon: "🔄",
      stepNumber: 11,
      title: "Status & Lifecycle Patterns",
      story: {
        title: "Maria's Journey Complete",
        content: `
                    <p>Maria's visit to City General Hospital is complete. Over the course of 90 minutes, her healthcare journey created a comprehensive digital record:</p>
                    <ul>
                        <li>✅ <strong>Appointment:</strong> proposed → booked → fulfilled</li>
                        <li>✅ <strong>Encounter:</strong> planned → in-progress → finished</li>
                        <li>✅ <strong>ServiceRequest:</strong> active → completed</li>
                        <li>✅ <strong>Observations:</strong> registered → final</li>
                        <li>✅ <strong>Condition:</strong> Confirmed and active on problem list</li>
                        <li>✅ <strong>MedicationRequest:</strong> Active prescription</li>
                        <li>✅ <strong>DiagnosticReport:</strong> Final and signed</li>
                    </ul>
                    <p>Maria leaves with prescriptions, a follow-up appointment scheduled for 4 weeks, and a clear understanding of her treatment plan.</p>
                `,
      },
      workflow: {
        title: "Understanding FHIR Resource Lifecycles",
        content: `
                    <p>Every FHIR resource follows a <strong>lifecycle</strong> defined by its status field. Understanding these patterns is crucial for:</p>
                    <ul>
                        <li><strong>Querying:</strong> Finding active vs. completed records</li>
                        <li><strong>Clinical Decision Support:</strong> Acting on current vs. historical data</li>
                        <li><strong>Auditing:</strong> Tracking changes over time</li>
                        <li><strong>Billing:</strong> Identifying completed services</li>
                    </ul>
                    <div class="lifecycle-diagram">
                        <div class="lifecycle-node">
                            <span class="lifecycle-status draft">Draft</span>
                        </div>
                        <span class="lifecycle-arrow">→</span>
                        <div class="lifecycle-node">
                            <span class="lifecycle-status active">Active</span>
                        </div>
                        <span class="lifecycle-arrow">→</span>
                        <div class="lifecycle-node">
                            <span class="lifecycle-status completed">Completed</span>
                        </div>
                        <span class="lifecycle-arrow" style="opacity: 0.5;">|</span>
                        <div class="lifecycle-node">
                            <span class="lifecycle-status cancelled">Cancelled</span>
                        </div>
                    </div>
                `,
      },
      fhirExplanation: {
        title: "Cross-Resource Status Patterns",
        content: `
                    <p>Different resources use different status value sets, but they follow consistent patterns:</p>
                    <div class="field-list">
                        <div class="field-item">
                            <span class="field-name">Appointment</span>
                            <span class="field-description">proposed → pending → booked → arrived → fulfilled | cancelled | noshow</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">Encounter</span>
                            <span class="field-description">planned → arrived → triaged → in-progress → onleave → finished | cancelled</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">ServiceRequest</span>
                            <span class="field-description">draft → active → on-hold → completed | revoked | entered-in-error</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">Observation</span>
                            <span class="field-description">registered → preliminary → final → amended | cancelled | entered-in-error</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">Condition</span>
                            <span class="field-description">active | recurrence | relapse | inactive | remission | resolved</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">MedicationRequest</span>
                            <span class="field-description">active → on-hold → completed | stopped | cancelled | entered-in-error</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">Procedure</span>
                            <span class="field-description">preparation → in-progress → not-done → on-hold → stopped → completed</span>
                        </div>
                        <div class="field-item">
                            <span class="field-name">DiagnosticReport</span>
                            <span class="field-description">registered → partial → preliminary → final → amended | cancelled | corrected</span>
                        </div>
                    </div>
                `,
      },
      fhirResource: {
        resourceType: "Bundle",
        id: "bundle-lifecycle-summary",
        meta: {
          lastUpdated: "2024-01-15T12:00:00Z",
        },
        type: "collection",
        total: 14,
        entry: [
          {
            fullUrl: "urn:uuid:patient-maria-santos",
            resource: {
              resourceType: "Patient",
              id: "patient-maria-santos",
              name: [{ family: "Santos", given: ["Maria"] }],
              identifier: [{ value: "MS-2024-0892" }],
              _comment:
                "CENTRAL RESOURCE - All clinical resources reference this patient. Maria presented with chest discomfort and shortness of breath.",
            },
          },
          {
            fullUrl: "urn:uuid:appointment-001",
            resource: {
              resourceType: "Appointment",
              id: "appointment-001",
              status: "fulfilled",
              reasonCode: [
                { text: "Chest discomfort and shortness of breath" },
              ],
              participant: [
                { actor: { reference: "Patient/patient-maria-santos" } },
              ],
              _comment:
                "ENTRY POINT - Patient's chief complaint drives the entire care journey. Status: proposed → booked → fulfilled",
            },
          },
          {
            fullUrl: "urn:uuid:encounter-001",
            resource: {
              resourceType: "Encounter",
              id: "encounter-001",
              status: "finished",
              reasonCode: [{ text: "Chest pain evaluation" }],
              subject: { reference: "Patient/patient-maria-santos" },
              appointment: [{ reference: "Appointment/appointment-001" }],
              diagnosis: [
                {
                  condition: {
                    reference: "Condition/condition-001",
                    display: "Hypertension",
                  },
                },
                {
                  condition: {
                    reference: "Condition/condition-002",
                    display: "Hyperlipidemia",
                  },
                },
              ],
              _comment:
                "ORGANIZING CONTAINER - All clinical activities during this visit link here. Chief complaint led to 2 diagnoses.",
            },
          },
          {
            fullUrl: "urn:uuid:observation-bp-001",
            resource: {
              resourceType: "Observation",
              id: "observation-bp-001",
              status: "final",
              code: { text: "Blood Pressure 148/92 mmHg" },
              subject: { reference: "Patient/patient-maria-santos" },
              encounter: { reference: "Encounter/encounter-001" },
              _comment:
                "EVIDENCE FOR DIAGNOSIS - Elevated BP supports Hypertension diagnosis (Condition/condition-001)",
            },
          },
          {
            fullUrl: "urn:uuid:servicerequest-001",
            resource: {
              resourceType: "ServiceRequest",
              id: "servicerequest-001",
              status: "completed",
              intent: "order",
              code: { text: "Lipid Panel" },
              reasonCode: [
                { text: "Evaluate cardiovascular risk for chest symptoms" },
              ],
              subject: { reference: "Patient/patient-maria-santos" },
              encounter: { reference: "Encounter/encounter-001" },
              _comment:
                "ORDERED TO EVALUATE - Labs requested because of patient's presenting complaint (chest discomfort)",
            },
          },
          {
            fullUrl: "urn:uuid:observation-001",
            resource: {
              resourceType: "Observation",
              id: "observation-001",
              status: "final",
              code: { text: "LDL Cholesterol 168 mg/dL (High)" },
              subject: { reference: "Patient/patient-maria-santos" },
              encounter: { reference: "Encounter/encounter-001" },
              basedOn: [{ reference: "ServiceRequest/servicerequest-001" }],
              _comment:
                "EVIDENCE FOR DIAGNOSIS - Elevated LDL supports Hyperlipidemia diagnosis (Condition/condition-002)",
            },
          },
          {
            fullUrl: "urn:uuid:condition-001",
            resource: {
              resourceType: "Condition",
              id: "condition-001",
              code: { text: "Essential Hypertension (I10)" },
              clinicalStatus: { coding: [{ code: "active" }] },
              verificationStatus: { coding: [{ code: "confirmed" }] },
              subject: { reference: "Patient/patient-maria-santos" },
              encounter: { reference: "Encounter/encounter-001" },
              evidence: [
                { detail: [{ reference: "Observation/observation-bp-001" }] },
              ],
              _comment:
                "DIAGNOSIS #1 - Discovered during evaluation of chest discomfort. Evidenced by BP 148/92",
            },
          },
          {
            fullUrl: "urn:uuid:condition-002",
            resource: {
              resourceType: "Condition",
              id: "condition-002",
              code: { text: "Hyperlipidemia (E78.5)" },
              clinicalStatus: { coding: [{ code: "active" }] },
              verificationStatus: { coding: [{ code: "confirmed" }] },
              subject: { reference: "Patient/patient-maria-santos" },
              encounter: { reference: "Encounter/encounter-001" },
              evidence: [
                { detail: [{ reference: "Observation/observation-001" }] },
              ],
              _comment:
                "DIAGNOSIS #2 - Discovered during cardiovascular workup. Evidenced by LDL 168 mg/dL",
            },
          },
          {
            fullUrl: "urn:uuid:allergyintolerance-001",
            resource: {
              resourceType: "AllergyIntolerance",
              id: "allergyintolerance-001",
              code: { text: "Penicillin allergy" },
              patient: { reference: "Patient/patient-maria-santos" },
              _comment:
                "SAFETY CHECK - Reviewed before prescribing medications for the diagnosed conditions",
            },
          },
          {
            fullUrl: "urn:uuid:medicationrequest-001",
            resource: {
              resourceType: "MedicationRequest",
              id: "medicationrequest-001",
              status: "active",
              intent: "order",
              medicationCodeableConcept: { text: "Lisinopril 10mg" },
              subject: { reference: "Patient/patient-maria-santos" },
              encounter: { reference: "Encounter/encounter-001" },
              reasonReference: [
                {
                  reference: "Condition/condition-001",
                  display: "Hypertension",
                },
              ],
              supportingInformation: [
                { reference: "Observation/observation-bp-001" },
              ],
              _comment:
                "TREATMENT FOR DIAGNOSIS #1 - Prescribed to treat Hypertension (BP 148/92)",
            },
          },
          {
            fullUrl: "urn:uuid:medicationrequest-002",
            resource: {
              resourceType: "MedicationRequest",
              id: "medicationrequest-002",
              status: "active",
              intent: "order",
              medicationCodeableConcept: { text: "Atorvastatin 20mg" },
              subject: { reference: "Patient/patient-maria-santos" },
              encounter: { reference: "Encounter/encounter-001" },
              reasonReference: [
                {
                  reference: "Condition/condition-002",
                  display: "Hyperlipidemia",
                },
              ],
              supportingInformation: [
                { reference: "Observation/observation-001" },
              ],
              _comment:
                "TREATMENT FOR DIAGNOSIS #2 - Prescribed to treat Hyperlipidemia (LDL 168)",
            },
          },
          {
            fullUrl: "urn:uuid:procedure-001",
            resource: {
              resourceType: "Procedure",
              id: "procedure-001",
              status: "completed",
              code: { text: "12-lead ECG" },
              subject: { reference: "Patient/patient-maria-santos" },
              encounter: { reference: "Encounter/encounter-001" },
              reasonReference: [{ reference: "Condition/condition-001" }],
              _comment:
                "DIAGNOSTIC PROCEDURE - ECG performed due to chest symptoms, supports cardiac evaluation",
            },
          },
          {
            fullUrl: "urn:uuid:diagnosticreport-001",
            resource: {
              resourceType: "DiagnosticReport",
              id: "diagnosticreport-001",
              status: "final",
              code: { text: "Lipid Panel Results" },
              subject: { reference: "Patient/patient-maria-santos" },
              encounter: { reference: "Encounter/encounter-001" },
              basedOn: [{ reference: "ServiceRequest/servicerequest-001" }],
              result: [{ reference: "Observation/observation-001" }],
              conclusionCode: [{ text: "Hyperlipidemia" }],
              _comment:
                "RESULTS COMPILATION - Links lab results to original order, supports diagnosis",
            },
          },
          {
            fullUrl: "urn:uuid:immunization-001",
            resource: {
              resourceType: "Immunization",
              id: "immunization-001",
              status: "completed",
              vaccineCode: { text: "Flu vaccine" },
              patient: { reference: "Patient/patient-maria-santos" },
              encounter: { reference: "Encounter/encounter-001" },
              reasonCode: [
                { text: "Cardiovascular risk - flu can stress heart" },
              ],
              _comment:
                "PREVENTIVE CARE - Given due to patient's cardiovascular risk from diagnosed conditions",
            },
          },
        ],
        _comment:
          "COMPLETE CARE JOURNEY: Patient's chief complaint (chest discomfort) → Encounter → Observations (BP, Labs) → 2 Diagnoses (Hypertension, Hyperlipidemia) → 2 Medications (Lisinopril, Atorvastatin) + ECG + Prevention (Flu shot)",
      },
    },
  ],
};

// Export for use in app.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = FHIRData;
}
