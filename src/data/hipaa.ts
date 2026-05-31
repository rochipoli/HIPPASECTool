// HIPAA Security Rule Implementation Specifications — 45 CFR Part 164, Subpart C
// R = Required  |  A = Addressable

export type SpecType = 'R' | 'A';
export type CategoryIcon = 'admin' | 'physical' | 'technical' | 'org' | 'policies';

export interface HipaaSpec {
  id: string;
  title: string;
  type: SpecType;
  description: string;
  guidance: string;
}

export interface HipaaStandard {
  id: string;
  title: string;
  cfr: string;
  description: string;
  specs: HipaaSpec[];
}

export interface HipaaCategory {
  id: string;
  title: string;
  cfr: string;
  icon: CategoryIcon;
  description: string;
  standards: HipaaStandard[];
}

export interface FlatSpec extends HipaaSpec {
  categoryId: string;
  standardId: string;
}

const categories: HipaaCategory[] = [
  {
    id: 'administrative',
    title: 'Administrative Safeguards',
    cfr: '§164.308',
    icon: 'admin',
    description:
      'Administrative actions, and policies and procedures to manage the selection, development, implementation, and maintenance of security measures to protect ePHI and manage workforce conduct.',
    standards: [
      {
        id: 'admin-1',
        title: 'Security Management Process',
        cfr: '§164.308(a)(1)',
        description:
          'Implement policies and procedures to prevent, detect, contain, and correct security violations.',
        specs: [
          {
            id: 'admin-1-1',
            title: 'Risk Analysis',
            type: 'R',
            description:
              'Conduct an accurate and thorough assessment of the potential risks and vulnerabilities to the confidentiality, integrity, and availability of ePHI held by the covered entity or business associate.',
            guidance:
              'Identify all ePHI your organization creates, receives, maintains, or transmits. Identify and document threats and vulnerabilities. Assess current security controls. Determine likelihood and impact of each threat. Document risk analysis results and review annually.',
          },
          {
            id: 'admin-1-2',
            title: 'Risk Management',
            type: 'R',
            description:
              'Implement security measures sufficient to reduce risks and vulnerabilities to a reasonable and appropriate level to comply with §164.306(a).',
            guidance:
              'Develop a risk management plan addressing identified risks. Prioritize security measures based on risk analysis results. Document implemented safeguards and track remediation. Reassess after significant changes.',
          },
          {
            id: 'admin-1-3',
            title: 'Sanction Policy',
            type: 'R',
            description:
              'Apply appropriate sanctions against workforce members who fail to comply with the security policies and procedures of the covered entity or business associate.',
            guidance:
              'Develop and document a formal sanction policy. Ensure workforce members are aware of consequences for non-compliance. Apply consistent sanctions based on severity of violation. Document all sanctions applied.',
          },
          {
            id: 'admin-1-4',
            title: 'Information System Activity Review',
            type: 'R',
            description:
              'Implement procedures to regularly review records of information system activity, such as audit logs, access reports, and security incident tracking reports.',
            guidance:
              'Define which logs and reports to review and how frequently. Assign responsibility for reviewing logs. Document review activities and findings. Investigate and escalate anomalous activity promptly.',
          },
        ],
      },
      {
        id: 'admin-2',
        title: 'Assigned Security Responsibility',
        cfr: '§164.308(a)(2)',
        description:
          'Identify the security official who is responsible for the development and implementation of the policies and procedures required by the Security Rule.',
        specs: [
          {
            id: 'admin-2-1',
            title: 'Security Official Designation',
            type: 'R',
            description:
              'Designate a security official who is responsible for the development and implementation of the policies and procedures required by the HIPAA Security Rule.',
            guidance:
              'Formally designate a Security Official in writing (may be same as Privacy Officer for small entities). Ensure the Security Official has appropriate authority and resources. Document the designation and communicate it to the workforce.',
          },
        ],
      },
      {
        id: 'admin-3',
        title: 'Workforce Security',
        cfr: '§164.308(a)(3)',
        description:
          'Implement policies and procedures to ensure all workforce members have appropriate access to ePHI and to prevent unauthorized access.',
        specs: [
          {
            id: 'admin-3-1',
            title: 'Authorization and/or Supervision',
            type: 'A',
            description:
              'Implement procedures for the authorization and/or supervision of workforce members who work with ePHI or in locations where it might be accessed.',
            guidance:
              'Define job roles and associated ePHI access needs. Implement supervisory procedures for workforce members handling ePHI. Document authorization procedures and review access appropriateness regularly.',
          },
          {
            id: 'admin-3-2',
            title: 'Workforce Clearance Procedure',
            type: 'A',
            description:
              'Implement procedures to determine that the access of a workforce member to ePHI is appropriate.',
            guidance:
              'Implement background check procedures appropriate to the level of ePHI access. Document screening procedures. Review access appropriateness at hire and periodically thereafter.',
          },
          {
            id: 'admin-3-3',
            title: 'Termination Procedures',
            type: 'A',
            description:
              'Implement procedures for terminating access to ePHI when the employment of, or other arrangement with, a workforce member ends.',
            guidance:
              'Document procedures to revoke all ePHI access upon termination. Implement immediate revocation for involuntary terminations. Retrieve all devices and access credentials. Use a termination checklist and document completion.',
          },
        ],
      },
      {
        id: 'admin-4',
        title: 'Information Access Management',
        cfr: '§164.308(a)(4)',
        description:
          'Implement policies and procedures for authorizing access to ePHI consistent with applicable Privacy Rule requirements.',
        specs: [
          {
            id: 'admin-4-1',
            title: 'Isolating Health Care Clearinghouse Function',
            type: 'R',
            description:
              'If a health care clearinghouse is part of a larger organization, implement policies and procedures that protect the ePHI of the clearinghouse from unauthorized access by the larger organization.',
            guidance:
              'If applicable, implement technical and administrative controls to isolate ePHI from the larger organization\'s systems. Mark as N/A if your organization is not a health care clearinghouse component of a larger entity.',
          },
          {
            id: 'admin-4-2',
            title: 'Access Authorization',
            type: 'A',
            description:
              'Implement policies and procedures for granting access to ePHI, for example, through access to a workstation, transaction, program, process, or other mechanism.',
            guidance:
              'Define process for granting ePHI access. Implement a formal request and approval workflow. Document all access grants. Apply the minimum necessary access principle (least privilege).',
          },
          {
            id: 'admin-4-3',
            title: 'Access Establishment and Modification',
            type: 'A',
            description:
              'Implement policies and procedures that establish, document, review, and modify a user\'s right of access to a workstation, transaction, program, or process.',
            guidance:
              'Document process for establishing user accounts and permissions. Implement regular access reviews (at least annually). Maintain audit trail of access changes. Revoke or modify access promptly upon role change.',
          },
        ],
      },
      {
        id: 'admin-5',
        title: 'Security Awareness and Training',
        cfr: '§164.308(a)(5)',
        description:
          'Implement a security awareness and training program for all members of its workforce (including management).',
        specs: [
          {
            id: 'admin-5-1',
            title: 'Security Reminders',
            type: 'A',
            description: 'Periodic security updates.',
            guidance:
              'Send regular security newsletters, alerts, or reminders to all workforce. Include security topics in staff meetings. Document security communications. Address emerging threats and policy changes.',
          },
          {
            id: 'admin-5-2',
            title: 'Protection from Malicious Software',
            type: 'A',
            description:
              'Procedures for guarding against, detecting, and reporting malicious software.',
            guidance:
              'Deploy and maintain anti-malware on all endpoints that access ePHI. Train workforce to identify phishing and social engineering attacks. Establish clear procedures for reporting suspected malware incidents.',
          },
          {
            id: 'admin-5-3',
            title: 'Log-in Monitoring',
            type: 'A',
            description:
              'Procedures for monitoring log-in attempts and reporting discrepancies.',
            guidance:
              'Configure alerts for suspicious login patterns (failed attempts, off-hours access, unusual locations). Train workforce to recognize and report suspicious login activity. Document monitoring procedures.',
          },
          {
            id: 'admin-5-4',
            title: 'Password Management',
            type: 'A',
            description: 'Procedures for creating, changing, and safeguarding passwords.',
            guidance:
              'Implement and communicate a password policy covering minimum length, complexity, and rotation requirements. Train workforce on password best practices. Consider implementing an organization-wide password manager.',
          },
        ],
      },
      {
        id: 'admin-6',
        title: 'Security Incident Procedures',
        cfr: '§164.308(a)(6)',
        description: 'Implement policies and procedures to address security incidents.',
        specs: [
          {
            id: 'admin-6-1',
            title: 'Response and Reporting',
            type: 'R',
            description:
              'Identify and respond to suspected or known security incidents; mitigate harmful effects; and document security incidents and their outcomes.',
            guidance:
              'Develop a formal security incident response plan with defined roles. Define incident severity levels and escalation paths. Establish reporting procedures including notification to the Privacy Officer. Document all incidents and responses. Conduct post-incident reviews.',
          },
        ],
      },
      {
        id: 'admin-7',
        title: 'Contingency Plan',
        cfr: '§164.308(a)(7)',
        description:
          'Establish policies and procedures for responding to an emergency or occurrence that damages systems containing ePHI.',
        specs: [
          {
            id: 'admin-7-1',
            title: 'Data Backup Plan',
            type: 'R',
            description:
              'Establish and implement procedures to create and maintain retrievable exact copies of ePHI.',
            guidance:
              'Define backup frequency, media type, and retention period. Implement automated backup solutions. Store backup copies offsite or in a separate cloud region. Test restoration capability regularly (at least quarterly).',
          },
          {
            id: 'admin-7-2',
            title: 'Disaster Recovery Plan',
            type: 'R',
            description:
              'Establish (and implement as needed) procedures to restore any loss of data.',
            guidance:
              'Document recovery procedures for all critical systems containing ePHI. Define Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO). Test the disaster recovery plan at least annually and after major changes.',
          },
          {
            id: 'admin-7-3',
            title: 'Emergency Mode Operation Plan',
            type: 'R',
            description:
              'Establish (and implement as needed) procedures to enable continuation of critical business processes for protection of the security of ePHI while operating in emergency mode.',
            guidance:
              'Define which operations must continue during an emergency. Document manual procedures for maintaining ePHI security during system downtime. Train workforce on emergency procedures. Review and update plan annually.',
          },
          {
            id: 'admin-7-4',
            title: 'Testing and Revision Procedure',
            type: 'A',
            description:
              'Implement procedures for periodic testing and revision of contingency plans.',
            guidance:
              'Conduct tabletop exercises or full tests of contingency plans at least annually. Document test scenarios, results, and lessons learned. Update plans based on test findings and operational changes.',
          },
          {
            id: 'admin-7-5',
            title: 'Applications and Data Criticality Analysis',
            type: 'A',
            description:
              'Assess the relative criticality of specific applications and data in support of other contingency plan components.',
            guidance:
              'Inventory all applications and data containing ePHI. Rate criticality based on operational impact. Use criticality ratings to prioritize recovery order. Document the analysis and review annually.',
          },
        ],
      },
      {
        id: 'admin-8',
        title: 'Evaluation',
        cfr: '§164.308(a)(8)',
        description:
          'Perform a periodic technical and nontechnical evaluation that establishes the extent to which security policies and procedures meet Security Rule requirements.',
        specs: [
          {
            id: 'admin-8-1',
            title: 'Periodic Security Evaluation',
            type: 'R',
            description:
              'Perform a periodic technical and nontechnical evaluation of security policies and procedures in response to environmental or operational changes affecting the security of ePHI.',
            guidance:
              'Schedule HIPAA security evaluations at least annually. Include technical assessments (vulnerability scans, penetration testing) and policy reviews. Document evaluation findings and remediation plans. Conduct additional evaluations after significant operational or environmental changes.',
          },
        ],
      },
      {
        id: 'admin-9',
        title: 'Business Associate Contracts and Other Arrangements',
        cfr: '§164.308(b)(1)',
        description:
          'A covered entity may permit a business associate to create, receive, maintain, or transmit ePHI only if it obtains satisfactory assurances that the BA will appropriately safeguard the information.',
        specs: [
          {
            id: 'admin-9-1',
            title: 'Written Contract or Other Arrangement',
            type: 'R',
            description:
              'Document satisfactory assurances from business associates through a written contract or other arrangement that meets the applicable requirements of §164.314(a).',
            guidance:
              'Maintain signed Business Associate Agreements (BAAs) with all business associates. Review BAAs to ensure they include required security provisions. Maintain a current Business Associate inventory. Verify BAs have appropriate safeguards through due diligence.',
          },
        ],
      },
    ],
  },
  {
    id: 'physical',
    title: 'Physical Safeguards',
    cfr: '§164.310',
    icon: 'physical',
    description:
      'Physical measures, policies, and procedures to protect electronic information systems and related buildings and equipment from natural and environmental hazards, and unauthorized intrusion.',
    standards: [
      {
        id: 'phys-1',
        title: 'Facility Access Controls',
        cfr: '§164.310(a)(1)',
        description:
          'Implement policies and procedures to limit physical access to electronic information systems and the facility or facilities in which they are housed, while ensuring authorized access is allowed.',
        specs: [
          {
            id: 'phys-1-1',
            title: 'Contingency Operations',
            type: 'A',
            description:
              'Establish (and implement as needed) procedures that allow facility access in support of restoration of lost data under the disaster recovery plan and emergency mode operations plan in the event of an emergency.',
            guidance:
              'Document how authorized personnel access the facility during emergencies. Identify who holds emergency access authority. Integrate physical access procedures into disaster recovery and emergency operation plans.',
          },
          {
            id: 'phys-1-2',
            title: 'Facility Security Plan',
            type: 'A',
            description:
              'Implement policies and procedures to safeguard the facility and the equipment therein from unauthorized physical access, tampering, and theft.',
            guidance:
              'Document physical security controls (badge readers, locks, visitor logs, security cameras). Conduct a physical security risk assessment. Implement layered physical security controls. Review and update the plan at least annually.',
          },
          {
            id: 'phys-1-3',
            title: 'Access Control and Validation Procedures',
            type: 'A',
            description:
              'Implement procedures to control and validate a person\'s access to facilities based on their role or function, including visitor control, and control of access to software programs for testing and revision.',
            guidance:
              'Implement role-based physical access controls using badges or key fobs. Maintain visitor logs with sign-in/sign-out records. Escort visitors in areas containing ePHI systems. Regularly review and update access control lists.',
          },
          {
            id: 'phys-1-4',
            title: 'Maintenance Records',
            type: 'A',
            description:
              'Implement policies and procedures to document repairs and modifications to the physical components of a facility which are related to security (hardware, walls, doors, and locks).',
            guidance:
              'Maintain records of all physical modifications to secure areas. Document work performed by contractors in secure areas with date, description, and authorization. Retain records for the required retention period.',
          },
        ],
      },
      {
        id: 'phys-2',
        title: 'Workstation Use',
        cfr: '§164.310(b)',
        description:
          'Implement policies and procedures that specify the proper functions to be performed, the manner in which those functions are to be performed, and the physical attributes of the surroundings of a specific workstation or class of workstation that can access ePHI.',
        specs: [
          {
            id: 'phys-2-1',
            title: 'Workstation Use Policy',
            type: 'R',
            description:
              'Implement policies and procedures specifying proper functions, manner of performance, and physical attributes of surroundings for workstations that access ePHI.',
            guidance:
              'Define acceptable use policy for all workstations with ePHI access. Address screen positioning to prevent unauthorized viewing. Specify rules for remote and home-based work. Train all workforce members on workstation use policies.',
          },
        ],
      },
      {
        id: 'phys-3',
        title: 'Workstation Security',
        cfr: '§164.310(c)',
        description:
          'Implement physical safeguards for all workstations that access ePHI, to restrict access to authorized users.',
        specs: [
          {
            id: 'phys-3-1',
            title: 'Physical Workstation Safeguards',
            type: 'R',
            description:
              'Implement physical safeguards for all workstations that access ePHI to restrict access to authorized users.',
            guidance:
              'Implement cable locks or secured mounts for workstations in open areas. Lock workstations in server rooms or secure enclosures when not in use. Configure screen locks after inactivity. Position monitors to minimize shoulder-surfing.',
          },
        ],
      },
      {
        id: 'phys-4',
        title: 'Device and Media Controls',
        cfr: '§164.310(d)(1)',
        description:
          'Implement policies and procedures that govern the receipt and removal of hardware and electronic media that contain ePHI into and out of a facility, and the movement of these items within the facility.',
        specs: [
          {
            id: 'phys-4-1',
            title: 'Disposal',
            type: 'R',
            description:
              'Implement policies and procedures to address the final disposition of ePHI, and/or the hardware or electronic media on which it is stored.',
            guidance:
              'Define procedures for securely disposing of devices containing ePHI (NIST 800-88 guidelines). Use certified data destruction services and obtain certificates of destruction. Document all disposed devices and media.',
          },
          {
            id: 'phys-4-2',
            title: 'Media Re-use',
            type: 'R',
            description:
              'Implement procedures for removal of ePHI from electronic media before the media are made available for re-use.',
            guidance:
              'Implement secure data wiping procedures using NIST-approved methods before reusing any media. Document sanitization activities including date, media ID, method, and employee. Verify successful sanitization.',
          },
          {
            id: 'phys-4-3',
            title: 'Accountability',
            type: 'A',
            description:
              'Maintain a record of the movements of hardware and electronic media and any person responsible therefore.',
            guidance:
              'Maintain an inventory of all hardware and electronic media containing ePHI. Track movements and transfers with chain-of-custody documentation. Conduct periodic physical inventory audits at least annually.',
          },
          {
            id: 'phys-4-4',
            title: 'Data Backup and Storage',
            type: 'A',
            description:
              'Create a retrievable, exact copy of ePHI, when needed, before movement of equipment.',
            guidance:
              'Require documented data backup before any hardware containing ePHI is relocated. Verify backup integrity after equipment is moved. Include this step in equipment relocation checklists.',
          },
        ],
      },
    ],
  },
  {
    id: 'technical',
    title: 'Technical Safeguards',
    cfr: '§164.312',
    icon: 'technical',
    description:
      'The technology and the policy and procedures for its use that protect ePHI and control access to it.',
    standards: [
      {
        id: 'tech-1',
        title: 'Access Control',
        cfr: '§164.312(a)(1)',
        description:
          'Implement technical policies and procedures for electronic information systems that maintain ePHI to allow access only to persons or software programs that have been granted access rights.',
        specs: [
          {
            id: 'tech-1-1',
            title: 'Unique User Identification',
            type: 'R',
            description:
              'Assign a unique name and/or number for identifying and tracking user identity.',
            guidance:
              'Ensure every user who accesses ePHI systems has a unique identifier. Prohibit sharing credentials. Implement a naming convention for user accounts. Maintain a complete user account inventory with current role assignments.',
          },
          {
            id: 'tech-1-2',
            title: 'Emergency Access Procedure',
            type: 'R',
            description:
              'Establish (and implement as needed) procedures for obtaining necessary ePHI during an emergency.',
            guidance:
              'Define documented emergency access procedures that balance security with operational needs. Implement enhanced logging for all emergency access events. Restrict who may authorize emergency access. Audit all emergency access events after the emergency ends.',
          },
          {
            id: 'tech-1-3',
            title: 'Automatic Logoff',
            type: 'A',
            description:
              'Implement electronic procedures that terminate an electronic session after a predetermined time of inactivity.',
            guidance:
              'Configure automatic screen lock and session timeout on all systems accessing ePHI (typically 15 minutes or less). Ensure timeout applies to all access paths including web, VPN, and remote desktop.',
          },
          {
            id: 'tech-1-4',
            title: 'Encryption and Decryption',
            type: 'A',
            description:
              'Implement a mechanism to encrypt and decrypt ePHI.',
            guidance:
              'Implement encryption for ePHI at rest using AES-256 or equivalent (NIST FIPS 140-2 validated). Implement full-disk encryption on all laptops and portable devices. Manage encryption keys securely using a key management system.',
          },
        ],
      },
      {
        id: 'tech-2',
        title: 'Audit Controls',
        cfr: '§164.312(b)',
        description:
          'Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use ePHI.',
        specs: [
          {
            id: 'tech-2-1',
            title: 'Audit Controls Implementation',
            type: 'R',
            description:
              'Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use ePHI.',
            guidance:
              'Enable audit logging on all systems containing ePHI. Log at minimum: user access events, ePHI modifications and deletions, login successes and failures, and privilege escalation. Store logs securely. Define a log retention period (minimum 6 years). Implement log monitoring and alerting.',
          },
        ],
      },
      {
        id: 'tech-3',
        title: 'Integrity',
        cfr: '§164.312(c)(1)',
        description:
          'Implement policies and procedures to protect ePHI from improper alteration or destruction.',
        specs: [
          {
            id: 'tech-3-1',
            title: 'Mechanism to Authenticate ePHI',
            type: 'A',
            description:
              'Implement electronic mechanisms to corroborate that ePHI has not been altered or destroyed in an unauthorized manner.',
            guidance:
              'Implement checksums or cryptographic hashing to verify ePHI integrity. Use digital signatures where appropriate for high-value records. Implement change detection and alerting for unauthorized modifications to ePHI datastores.',
          },
        ],
      },
      {
        id: 'tech-4',
        title: 'Person or Entity Authentication',
        cfr: '§164.312(d)',
        description:
          'Implement procedures to verify that a person or entity seeking access to ePHI is the one claimed.',
        specs: [
          {
            id: 'tech-4-1',
            title: 'Authentication Mechanisms',
            type: 'R',
            description:
              'Implement procedures to verify that a person or entity seeking access to ePHI is the one claimed.',
            guidance:
              'Implement multi-factor authentication (MFA) for all systems accessing ePHI, especially remote access. Enforce strong password policies. Consider hardware tokens or biometrics for high-risk systems. Document authentication mechanisms for every ePHI-bearing system.',
          },
        ],
      },
      {
        id: 'tech-5',
        title: 'Transmission Security',
        cfr: '§164.312(e)(1)',
        description:
          'Implement technical security measures to guard against unauthorized access to ePHI that is being transmitted over an electronic communications network.',
        specs: [
          {
            id: 'tech-5-1',
            title: 'Integrity Controls',
            type: 'A',
            description:
              'Implement security measures to ensure that electronically transmitted ePHI is not improperly modified without detection until disposed of.',
            guidance:
              'Use secure protocols with built-in integrity checking (TLS). Implement message authentication codes (MACs) for high-integrity transmission requirements. Monitor transmission errors and anomalies.',
          },
          {
            id: 'tech-5-2',
            title: 'Encryption',
            type: 'A',
            description:
              'Implement a mechanism to encrypt ePHI whenever deemed appropriate.',
            guidance:
              'Encrypt all ePHI transmitted over public networks using TLS 1.2 or higher. Use secure email (S/MIME, PGP, or a HIPAA-compliant secure messaging portal). Prohibit transmission of unencrypted ePHI over public networks or unencrypted email.',
          },
        ],
      },
    ],
  },
  {
    id: 'organizational',
    title: 'Organizational Requirements',
    cfr: '§164.314',
    icon: 'org',
    description:
      'Requirements for business associate contracts and other arrangements, and requirements for group health plans.',
    standards: [
      {
        id: 'org-1',
        title: 'Business Associate Contracts or Other Arrangements',
        cfr: '§164.314(a)(1)',
        description:
          'The contract or other arrangement with a business associate must meet the requirements of §164.314(a)(2).',
        specs: [
          {
            id: 'org-1-1',
            title: 'Business Associate Contract Requirements',
            type: 'R',
            description:
              'The contract between a covered entity and a business associate must provide that the business associate will implement appropriate safeguards to protect ePHI.',
            guidance:
              'Ensure all BAAs include requirements for: implementing appropriate safeguards, reporting security incidents, ensuring downstream subcontractors comply, and making internal practices available for HHS audit. Maintain executed BAA copies.',
          },
          {
            id: 'org-1-2',
            title: 'Other Arrangements',
            type: 'R',
            description:
              'When both parties are governmental entities, a memorandum of understanding (MOU) satisfying the requirements of §164.314(a)(2)(ii) may be used.',
            guidance:
              'If applicable, ensure governmental MOUs include equivalent security provisions to BAAs. Document the legal basis for using an MOU instead of a BAA. Review MOUs on the same schedule as BAAs.',
          },
        ],
      },
      {
        id: 'org-2',
        title: 'Requirements for Group Health Plans',
        cfr: '§164.314(b)(1)',
        description:
          'A group health plan must ensure that its plan documents provide that the plan sponsor will reasonably and appropriately safeguard ePHI.',
        specs: [
          {
            id: 'org-2-1',
            title: 'Plan Document Requirements',
            type: 'R',
            description:
              'The group health plan must ensure that its plan documents provide for the implementation of adequate security measures to protect ePHI.',
            guidance:
              'If your organization sponsors a group health plan, ensure plan documents include required HIPAA Security Rule provisions per §164.314(b)(2). Review plan documents with legal counsel annually. Mark as N/A if not applicable.',
          },
        ],
      },
    ],
  },
  {
    id: 'policies',
    title: 'Policies, Procedures & Documentation',
    cfr: '§164.316',
    icon: 'policies',
    description:
      'Requirements for implementing reasonable and appropriate policies and procedures and maintaining written documentation.',
    standards: [
      {
        id: 'pol-1',
        title: 'Policies and Procedures',
        cfr: '§164.316(a)',
        description:
          'Implement reasonable and appropriate policies and procedures to comply with the standards, implementation specifications, or other requirements of the Security Rule.',
        specs: [
          {
            id: 'pol-1-1',
            title: 'Reasonable and Appropriate Policies',
            type: 'R',
            description:
              'Implement reasonable and appropriate policies and procedures to comply with HIPAA Security Rule standards and implementation specifications, taking into account organizational size, complexity, and capabilities.',
            guidance:
              'Develop comprehensive written security policies and procedures that address all Security Rule requirements. Ensure policies are appropriate to your organization\'s size and capabilities. Review and update policies at least annually.',
          },
        ],
      },
      {
        id: 'pol-2',
        title: 'Documentation',
        cfr: '§164.316(b)(1)',
        description:
          'Maintain the policies and procedures implemented to comply with the Security Rule in written form and retain documentation for the required period.',
        specs: [
          {
            id: 'pol-2-1',
            title: 'Time Limit',
            type: 'R',
            description:
              'Retain the documentation required by §164.316(b)(1) for 6 years from the date of its creation or the date when it last was in effect, whichever is later.',
            guidance:
              'Implement a document retention system with a minimum 6-year retention period for all HIPAA-related policies, procedures, risk analyses, training records, and security incident documentation.',
          },
          {
            id: 'pol-2-2',
            title: 'Availability',
            type: 'R',
            description:
              'Make documentation available to those persons responsible for implementing the procedures to which the documentation pertains.',
            guidance:
              'Maintain an accessible repository of all security policies and procedures. Ensure relevant workforce members can access applicable policies. Implement version control for policy documents.',
          },
          {
            id: 'pol-2-3',
            title: 'Updates',
            type: 'R',
            description:
              'Review documentation periodically, and update as needed, in response to environmental or operational changes affecting the security of ePHI.',
            guidance:
              'Conduct formal policy reviews at least annually. Trigger additional reviews for significant operational changes, security incidents, technology upgrades, or regulatory updates. Document each review including date, reviewer name, and changes made.',
          },
        ],
      },
    ],
  },
];

const allSpecs: FlatSpec[] = categories.flatMap(cat =>
  cat.standards.flatMap(std =>
    std.specs.map(spec => ({ ...spec, categoryId: cat.id, standardId: std.id }))
  )
);

export const HIPAA_DATA = {
  categories,
  allSpecs,
  totalSpecs: allSpecs.length,
};
