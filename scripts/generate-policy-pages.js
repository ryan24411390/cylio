/**
 * generate-policy-pages.js
 * Generates all legal/policy pages from the privacy-policy template.
 * Creates 17 new pages (16 policies + 1 legal hub).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATE_PATH = path.join(ROOT, 'privacy-policy', 'index.html');

// Read the privacy-policy page as template
const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

// ─── Page Definitions ────────────────────────────────────────────────

const pages = [
  {
    slug: 'legal',
    title: 'Legal & Policies',
    fullTitle: 'Legal & Policies - Cylio',
    metaDescription: 'Access all of Cylio LLC\'s legal documents, policies, and compliance information in one place.',
    content: getLegalHubContent()
  },
  {
    slug: 'terms-of-service',
    title: 'Terms of Service',
    fullTitle: 'Terms of Service - Cylio',
    metaDescription: 'Read Cylio LLC\'s terms of service governing the use of our website, services, and client engagements.',
    content: getTermsContent()
  },
  {
    slug: 'refund-policy',
    title: 'Refund Policy',
    fullTitle: 'Refund Policy - Cylio',
    metaDescription: 'Understand Cylio LLC\'s refund policy, including eligibility, process, and timeframes for service refund requests.',
    content: getRefundContent()
  },
  {
    slug: 'cancellation-policy',
    title: 'Cancellation Policy',
    fullTitle: 'Cancellation Policy - Cylio',
    metaDescription: 'Learn about Cylio LLC\'s cancellation policy, including how to cancel services, applicable timeframes, and any associated obligations.',
    content: getCancellationContent()
  },
  {
    slug: 'billing-policy',
    title: 'Billing Policy',
    fullTitle: 'Billing Policy - Cylio',
    metaDescription: 'Review Cylio LLC\'s billing policy covering payment methods, invoicing, payment terms, and dispute resolution.',
    content: getBillingContent()
  },
  {
    slug: 'acceptable-use-policy',
    title: 'Acceptable Use Policy',
    fullTitle: 'Acceptable Use Policy - Cylio',
    metaDescription: 'Read Cylio LLC\'s acceptable use policy outlining permitted and prohibited uses of our services and website.',
    content: getAcceptableUseContent()
  },
  {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    fullTitle: 'Cookie Policy - Cylio',
    metaDescription: 'Learn how Cylio LLC uses cookies and similar technologies on our website, and how you can manage your preferences.',
    content: getCookieContent()
  },
  {
    slug: 'disclaimer',
    title: 'Disclaimer',
    fullTitle: 'Disclaimer - Cylio',
    metaDescription: 'Read Cylio LLC\'s general disclaimer regarding the information, services, and content provided on our website.',
    content: getDisclaimerContent()
  },
  {
    slug: 'fulfillment-policy',
    title: 'Fulfillment Policy',
    fullTitle: 'Fulfillment Policy - Cylio',
    metaDescription: 'Understand Cylio LLC\'s service fulfillment policy, including delivery process, timelines, and client responsibilities.',
    content: getFulfillmentContent()
  },
  {
    slug: 'support-policy',
    title: 'Support Policy',
    fullTitle: 'Support Policy - Cylio',
    metaDescription: 'Learn about Cylio LLC\'s client support channels, response times, support scope, and escalation procedures.',
    content: getSupportContent()
  },
  {
    slug: 'complaint-resolution',
    title: 'Complaint Resolution',
    fullTitle: 'Complaint Resolution - Cylio',
    metaDescription: 'Learn how to file a complaint with Cylio LLC and understand our investigation, resolution, and escalation process.',
    content: getComplaintContent()
  },
  {
    slug: 'data-request',
    title: 'Privacy Rights & Data Requests',
    fullTitle: 'Privacy Rights & Data Requests - Cylio',
    metaDescription: 'Exercise your privacy rights with Cylio LLC. Learn how to submit data access, correction, deletion, and portability requests.',
    content: getDataRequestContent()
  },
  {
    slug: 'accessibility',
    title: 'Accessibility Statement',
    fullTitle: 'Accessibility Statement - Cylio',
    metaDescription: 'Read Cylio LLC\'s commitment to digital accessibility and learn about the standards we follow to make our website usable for everyone.',
    content: getAccessibilityContent()
  },
  {
    slug: 'intellectual-property',
    title: 'Intellectual Property Notice',
    fullTitle: 'Intellectual Property Notice - Cylio',
    metaDescription: 'Understand Cylio LLC\'s intellectual property rights, including ownership of content, trademarks, and client deliverables.',
    content: getIPContent()
  },
  {
    slug: 'dmca',
    title: 'DMCA & Copyright',
    fullTitle: 'DMCA & Copyright - Cylio',
    metaDescription: 'Learn how to file a DMCA notice or counter-notification with Cylio LLC regarding copyright concerns.',
    content: getDMCAContent()
  },
  {
    slug: 'security',
    title: 'Security & Responsible Disclosure',
    fullTitle: 'Security & Responsible Disclosure - Cylio',
    metaDescription: 'Learn about Cylio LLC\'s security practices and how to responsibly report potential vulnerabilities.',
    content: getSecurityContent()
  },
  {
    slug: 'communication-policy',
    title: 'Communication Policy',
    fullTitle: 'Communication Policy - Cylio',
    metaDescription: 'Understand how Cylio LLC communicates with clients and visitors, including message types, frequency, and opt-out options.',
    content: getCommunicationContent()
  }
];

// ─── Generator Logic ────────────────────────────────────────────────

function generatePage(page) {
  let html = template;

  // 1. Replace <title>
  html = html.replace(/<title>.*?<\/title>/, `<title>${page.fullTitle}</title>`);

  // 2. Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${page.metaDescription}" />`
  );

  // 3. Replace canonical URL
  html = html.replace(
    /<link rel="canonical" href="\/privacy-policy\/" \/>/,
    `<link rel="canonical" href="/${page.slug}/" />`
  );

  // 4. Replace OG tags
  html = html.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${page.fullTitle}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${page.metaDescription}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="\/privacy-policy\/" \/>/,
    `<meta property="og:url" content="/${page.slug}/" />`
  );

  // 5. Replace JSON-LD schema
  const schemaRegex = /<script type="application\/ld\+json" class="yoast-schema-graph">.*?<\/script>/s;
  const newSchema = buildSchema(page);
  html = html.replace(schemaRegex, `<script type="application/ld+json" class="yoast-schema-graph">${JSON.stringify(newSchema)}</script>`);

  // 6. Replace H1 title
  html = html.replace(/<h1>Privacy Policy<\/h1>/, `<h1>${page.title}</h1>`);

  // 7. Replace main content (the et_pb_text_inner with h2 through contact paragraph)
  const contentRegex = /<div class="et_pb_text_inner"><h2>Privacy Policy<\/h2>[\s\S]*?you may contact us here\.<\/a><\/p><\/div>/;
  html = html.replace(contentRegex, `<div class="et_pb_text_inner">${page.content}</div>`);

  // 8. Replace form action URL
  html = html.replace(
    /action='\/privacy-policy\/#gf_2'/,
    `action='/${page.slug}/#gf_2'`
  );

  // 9. Replace body class
  html = html.replace(
    /class="privacy-policy/,
    `class="${page.slug}`
  );

  // 10. Replace article ID
  html = html.replace(
    /id="post-3" class="post-3/,
    `id="post-${page.slug}" class="post-${page.slug}`
  );

  return html;
}

function buildSchema(page) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `/${page.slug}/`,
        "url": `/${page.slug}/`,
        "name": page.fullTitle,
        "isPartOf": { "@id": "/#website" },
        "datePublished": "2026-03-13T00:00:00+00:00",
        "dateModified": "2026-03-13T00:00:00+00:00",
        "description": page.metaDescription,
        "breadcrumb": { "@id": `/${page.slug}/#breadcrumb` },
        "inLanguage": "en-US",
        "potentialAction": [{ "@type": "ReadAction", "target": [`/${page.slug}/`] }]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `/${page.slug}/#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "/" },
          { "@type": "ListItem", "position": 2, "name": page.title }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "/#website",
        "url": "/",
        "name": "Cylio",
        "description": "Personalized and professional graphic and web design services tailored to your needs.",
        "publisher": { "@id": "/#organization" },
        "alternateName": "Cylio",
        "inLanguage": "en-US"
      },
      {
        "@type": "Organization",
        "@id": "/#organization",
        "name": "Cylio",
        "alternateName": "Cylio LLC",
        "url": "/",
        "logo": {
          "@type": "ImageObject",
          "inLanguage": "en-US",
          "@id": "/#/schema/logo/image/",
          "url": "/assets/img/2022/08/image001.png",
          "contentUrl": "/assets/img/2022/08/image001.png",
          "width": 464,
          "height": 71,
          "caption": "Cylio"
        },
        "image": { "@id": "/#/schema/logo/image/" },
        "sameAs": ["https://cylio.io"]
      }
    ]
  };
}

// ─── Content Functions ──────────────────────────────────────────────

function contactBlock() {
  return `<h3>Contact Us</h3>
<p>If you have questions about this policy, please contact us:</p>
<ul>
<li><strong>Email:</strong> <a href="mailto:support@cylio.io">support@cylio.io</a></li>
<li><strong>Phone:</strong> <a href="tel:+17187817927">+1 (718) 781-7927</a></li>
<li><strong>Mail:</strong> Cylio LLC, 1910 Thomes Ave, Cheyenne, WY 82001</li>
</ul>`;
}

function lastUpdated() {
  return `<p><em>Last updated: March 13, 2026</em></p>`;
}

function getLegalHubContent() {
  return `<h2>Legal & Policies</h2>
${lastUpdated()}
<p>This page provides access to all of Cylio LLC's legal documents, policies, and compliance information. We are committed to transparency and encourage you to review any policies relevant to your use of our services.</p>
<h3>Core Policies</h3>
<ul>
<li><a href="/terms-of-service/">Terms of Service</a></li>
<li><a href="/privacy-policy/">Privacy Policy</a></li>
<li><a href="/cookie-policy/">Cookie Policy</a></li>
<li><a href="/acceptable-use-policy/">Acceptable Use Policy</a></li>
</ul>
<h3>Billing & Payments</h3>
<ul>
<li><a href="/billing-policy/">Billing Policy</a></li>
<li><a href="/refund-policy/">Refund Policy</a></li>
<li><a href="/cancellation-policy/">Cancellation Policy</a></li>
</ul>
<h3>Service & Delivery</h3>
<ul>
<li><a href="/fulfillment-policy/">Fulfillment Policy</a></li>
<li><a href="/support-policy/">Support Policy</a></li>
<li><a href="/disclaimer/">Disclaimer</a></li>
</ul>
<h3>Consumer Rights</h3>
<ul>
<li><a href="/complaint-resolution/">Complaint Resolution</a></li>
<li><a href="/data-request/">Privacy Rights & Data Requests</a></li>
<li><a href="/communication-policy/">Communication Policy</a></li>
</ul>
<h3>Legal Notices</h3>
<ul>
<li><a href="/intellectual-property/">Intellectual Property Notice</a></li>
<li><a href="/dmca/">DMCA & Copyright</a></li>
<li><a href="/security/">Security & Responsible Disclosure</a></li>
<li><a href="/accessibility/">Accessibility Statement</a></li>
</ul>
${contactBlock()}`;
}

function getTermsContent() {
  return `<h2>Terms of Service</h2>
${lastUpdated()}
<p>These Terms of Service ("Terms") govern your access to and use of the website, products, and services provided by Cylio LLC ("Cylio," "we," "us," or "our"). By accessing or using our services, you agree to be bound by these Terms. If you do not agree, please do not use our services.</p>
<h3>1. Services</h3>
<p>Cylio provides web design, web development, branding, graphic design, and related digital services on a project or retainer basis. The specific scope, deliverables, and timeline for each engagement are defined in a separate written agreement, statement of work, or proposal accepted by both parties.</p>
<h3>2. Eligibility</h3>
<p>You must be at least 18 years of age and have the legal authority to enter into a binding agreement to use our services. By engaging Cylio, you represent that you meet these requirements.</p>
<h3>3. Client Responsibilities</h3>
<p>Clients are responsible for providing accurate and timely information, content, feedback, and approvals as needed for project completion. Delays caused by the client may affect project timelines and are not the responsibility of Cylio.</p>
<h3>4. Payment Terms</h3>
<p>Payment terms, including amounts, schedules, and methods, are specified in the applicable project agreement. All fees are quoted in United States Dollars (USD) unless otherwise stated. For more detail, please review our <a href="/billing-policy/">Billing Policy</a>.</p>
<h3>5. Intellectual Property</h3>
<p>Unless otherwise agreed in writing, Cylio retains ownership of all proprietary tools, frameworks, and pre-existing materials. Upon full payment, clients receive a license or assignment of rights to deliverables as specified in the project agreement. For more information, see our <a href="/intellectual-property/">Intellectual Property Notice</a>.</p>
<h3>6. Confidentiality</h3>
<p>Both parties agree to keep confidential any proprietary or sensitive information shared during the course of an engagement. This obligation survives the termination of the business relationship.</p>
<h3>7. Limitation of Liability</h3>
<p>To the maximum extent permitted by applicable law, Cylio's total liability arising out of or related to these Terms or any service shall not exceed the total fees paid by the client for the specific project giving rise to the claim. Cylio shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
<h3>8. Disclaimer of Warranties</h3>
<p>Our services are provided "as is" and "as available." Cylio makes no warranties, express or implied, regarding the results or outcomes of any project. We do not guarantee that deliverables will achieve specific business results, search engine rankings, or revenue targets.</p>
<h3>9. Indemnification</h3>
<p>You agree to indemnify and hold harmless Cylio, its officers, employees, and agents from and against any claims, damages, losses, or expenses arising out of your use of our services, your breach of these Terms, or your violation of any applicable law.</p>
<h3>10. Termination</h3>
<p>Either party may terminate an engagement in accordance with the terms of the applicable project agreement. Cylio reserves the right to suspend or terminate services for non-payment or material breach. For details on cancellation procedures, see our <a href="/cancellation-policy/">Cancellation Policy</a>.</p>
<h3>11. Governing Law</h3>
<p>These Terms are governed by and construed in accordance with the laws of the State of Wyoming, United States, without regard to its conflict of law principles.</p>
<h3>12. Dispute Resolution</h3>
<p>Any disputes arising under these Terms shall first be addressed through good-faith negotiation. If the parties cannot resolve the dispute informally, it shall be submitted to binding arbitration in Cheyenne, Wyoming, or as otherwise agreed by the parties.</p>
<h3>13. Modifications</h3>
<p>Cylio reserves the right to update these Terms at any time. Changes will be posted on this page with a revised "Last updated" date. Continued use of our services following any changes constitutes acceptance of the revised Terms.</p>
<h3>14. Severability</h3>
<p>If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.</p>
<h3>15. Entire Agreement</h3>
<p>These Terms, together with any applicable project agreement, constitute the entire agreement between you and Cylio regarding the subject matter herein and supersede all prior agreements and understandings.</p>
${contactBlock()}`;
}

function getRefundContent() {
  return `<h2>Refund Policy</h2>
${lastUpdated()}
<p>Cylio LLC ("Cylio") values every client relationship. This Refund Policy outlines the circumstances under which refunds may be issued for services provided by Cylio.</p>
<h3>Eligibility for Refunds</h3>
<p>Refund eligibility depends on the nature of the service, the stage of the project, and the terms of the applicable project agreement. Refund requests are evaluated on a case-by-case basis.</p>
<h3>When Refunds May Be Issued</h3>
<ul>
<li>Services paid for but not yet commenced, subject to any applicable cancellation fees</li>
<li>Duplicate or erroneous charges</li>
<li>Material failure by Cylio to deliver agreed-upon services, as determined by the project agreement</li>
</ul>
<h3>When Refunds Are Generally Not Available</h3>
<ul>
<li>Services that have been substantially performed or completed</li>
<li>Custom work delivered and accepted by the client</li>
<li>Situations where the client failed to provide required materials or approvals, resulting in project delays or scope changes</li>
<li>Change-of-mind requests after work has begun</li>
</ul>
<h3>How to Request a Refund</h3>
<p>To request a refund, please contact us at <a href="mailto:support@cylio.io">support@cylio.io</a> with your project details, the reason for your request, and any supporting documentation. We will acknowledge your request within two (2) business days.</p>
<h3>Processing Timeframes</h3>
<p>Approved refunds are typically processed within ten (10) business days. Refunds are issued using the original payment method unless otherwise agreed. Depending on your financial institution, it may take additional time for the refund to appear on your statement.</p>
<h3>Partial Refunds</h3>
<p>In cases where work has been partially completed, Cylio may issue a partial refund reflecting the portion of services not yet rendered, less any applicable fees for work already performed.</p>
<h3>Related Policies</h3>
<p>Please also review our <a href="/cancellation-policy/">Cancellation Policy</a> and <a href="/billing-policy/">Billing Policy</a> for additional information about payments and service termination.</p>
${contactBlock()}`;
}

function getCancellationContent() {
  return `<h2>Cancellation Policy</h2>
${lastUpdated()}
<p>This Cancellation Policy explains how clients may cancel services with Cylio LLC ("Cylio") and the effects of cancellation on active engagements.</p>
<h3>How to Cancel</h3>
<p>To cancel a service or project, please notify us in writing by emailing <a href="mailto:support@cylio.io">support@cylio.io</a>. Your cancellation request should include your name, project details, and the reason for cancellation.</p>
<h3>Cancellation Before Work Begins</h3>
<p>If you cancel before any work has commenced, you may be eligible for a full refund of any prepaid fees, subject to the terms of your project agreement.</p>
<h3>Cancellation After Work Has Begun</h3>
<p>If work is already in progress, cancellation terms will depend on the stage of the project. You may be responsible for payment covering:</p>
<ul>
<li>Work already completed up to the date of cancellation</li>
<li>Third-party costs or commitments made on your behalf</li>
<li>Any cancellation fees specified in the project agreement</li>
</ul>
<h3>Cancellation by Cylio</h3>
<p>Cylio reserves the right to cancel or suspend services if a client fails to make required payments, breaches the terms of the project agreement, or engages in conduct that violates our <a href="/acceptable-use-policy/">Acceptable Use Policy</a>.</p>
<h3>Effects of Cancellation</h3>
<p>Upon cancellation, Cylio will deliver any completed work product to the client, subject to full payment for services rendered. Access to any active project materials or accounts may be suspended until outstanding balances are settled.</p>
<h3>Reactivation</h3>
<p>If you wish to resume a cancelled project, please contact us. Reactivation is subject to availability and may require a new project agreement.</p>
<h3>Related Policies</h3>
<p>Please also review our <a href="/refund-policy/">Refund Policy</a> and <a href="/billing-policy/">Billing Policy</a> for additional details.</p>
${contactBlock()}`;
}

function getBillingContent() {
  return `<h2>Billing Policy</h2>
${lastUpdated()}
<p>This Billing Policy outlines the payment terms, invoicing procedures, and billing practices for services provided by Cylio LLC ("Cylio").</p>
<h3>Currency</h3>
<p>All fees and charges are quoted and billed in United States Dollars (USD) unless otherwise specified in a written agreement.</p>
<h3>Payment Methods</h3>
<p>Cylio accepts payment via bank transfer (ACH), wire transfer, credit card, and other methods as agreed upon in the project agreement. Specific payment instructions are provided on each invoice.</p>
<h3>Invoicing</h3>
<p>Invoices are issued according to the payment schedule defined in your project agreement. This may include upfront deposits, milestone-based payments, or recurring billing depending on the nature of the engagement.</p>
<h3>Payment Terms</h3>
<p>Unless otherwise stated in your project agreement, payment is due within fifteen (15) days of invoice date. Deposits are due before work commences and are typically non-refundable.</p>
<h3>Late Payments</h3>
<p>Payments not received by the due date may be subject to late fees as specified in your project agreement. Cylio reserves the right to pause or suspend work on any project with overdue payments until the outstanding balance is resolved.</p>
<h3>Taxes</h3>
<p>Fees quoted by Cylio are exclusive of applicable taxes unless explicitly stated otherwise. Clients are responsible for any applicable sales tax, value-added tax, or other taxes required by their jurisdiction.</p>
<h3>Billing Disputes</h3>
<p>If you believe there is an error on your invoice, please contact us at <a href="mailto:support@cylio.io">support@cylio.io</a> within fifteen (15) days of receiving the invoice. We will review your concern and work to resolve any discrepancies promptly.</p>
<h3>Related Policies</h3>
<p>Please also review our <a href="/refund-policy/">Refund Policy</a> and <a href="/cancellation-policy/">Cancellation Policy</a> for information about refunds and service termination.</p>
${contactBlock()}`;
}

function getAcceptableUseContent() {
  return `<h2>Acceptable Use Policy</h2>
${lastUpdated()}
<p>This Acceptable Use Policy ("AUP") governs the use of Cylio LLC's ("Cylio") website, services, and deliverables. By using our services, you agree to comply with this policy.</p>
<h3>Permitted Use</h3>
<p>Our website and services are intended for lawful business purposes. You may use our website to learn about our services, contact us, and engage with our content in a manner consistent with these guidelines.</p>
<h3>Prohibited Activities</h3>
<p>You agree not to:</p>
<ul>
<li>Use our services for any unlawful purpose or in violation of any applicable law or regulation</li>
<li>Submit or transmit content that is defamatory, obscene, fraudulent, or that infringes on the rights of others</li>
<li>Attempt to gain unauthorized access to our systems, networks, or data</li>
<li>Introduce malware, viruses, or other harmful code to our website or systems</li>
<li>Interfere with or disrupt the operation of our website or services</li>
<li>Use automated tools to scrape, crawl, or extract data from our website without written permission</li>
<li>Impersonate any person or entity or misrepresent your affiliation with any person or entity</li>
<li>Use our deliverables or services in a way that could harm Cylio's reputation or brand</li>
</ul>
<h3>Content Standards</h3>
<p>Any content you provide to Cylio for use in a project (text, images, logos, etc.) must be content you own or have the legal right to use. You are solely responsible for ensuring that your content does not infringe on third-party intellectual property rights.</p>
<h3>Monitoring and Enforcement</h3>
<p>Cylio reserves the right to monitor the use of its services and to investigate any suspected violations of this AUP. We may take any action we deem appropriate, including warning the user, suspending or terminating services, or pursuing legal remedies.</p>
<h3>Reporting Violations</h3>
<p>If you become aware of any misuse of our services or violations of this AUP, please report it to <a href="mailto:support@cylio.io">support@cylio.io</a>.</p>
<h3>Related Policies</h3>
<p>Please also review our <a href="/terms-of-service/">Terms of Service</a> and <a href="/intellectual-property/">Intellectual Property Notice</a>.</p>
${contactBlock()}`;
}

function getCookieContent() {
  return `<h2>Cookie Policy</h2>
${lastUpdated()}
<p>This Cookie Policy explains how Cylio LLC ("Cylio") uses cookies and similar technologies on our website. By continuing to use our website, you acknowledge this policy.</p>
<h3>What Are Cookies</h3>
<p>Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work efficiently, to provide information to the site owners, and to improve the user experience.</p>
<h3>Types of Cookies We Use</h3>
<h4>Essential Cookies</h4>
<p>These cookies are necessary for the basic functionality of our website. They enable features such as page navigation, form submissions, and security. The website may not function properly without these cookies.</p>
<h4>Analytics Cookies</h4>
<p>We may use analytics cookies to understand how visitors interact with our website, including which pages are visited most frequently and how users navigate the site. This helps us improve our website and services. These cookies collect information in an aggregated form.</p>
<h4>Functional Cookies</h4>
<p>Functional cookies allow our website to remember choices you have made (such as language or region preferences) and provide enhanced, more personalized features.</p>
<h3>Third-Party Cookies</h3>
<p>Some cookies on our website may be placed by third-party services we use, such as analytics providers or embedded content platforms. These third parties have their own privacy and cookie policies, which we encourage you to review.</p>
<h3>Managing Cookies</h3>
<p>Most web browsers allow you to control cookies through their settings. You can typically set your browser to refuse all cookies, accept only certain cookies, or notify you when a cookie is being set. Please note that disabling cookies may affect the functionality of our website.</p>
<p>For more information about managing cookies, visit your browser's help documentation or <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.</p>
<h3>Changes to This Policy</h3>
<p>We may update this Cookie Policy from time to time. Changes will be posted on this page with a revised date.</p>
<h3>Related Policies</h3>
<p>Please also review our <a href="/privacy-policy/">Privacy Policy</a> for additional information about how we handle your personal data.</p>
${contactBlock()}`;
}

function getDisclaimerContent() {
  return `<h2>Disclaimer</h2>
${lastUpdated()}
<p>The information provided on this website and through the services of Cylio LLC ("Cylio") is for general informational purposes only. By accessing this website or using our services, you acknowledge and agree to the following.</p>
<h3>General Disclaimer</h3>
<p>While we strive to provide accurate and up-to-date information on our website, Cylio makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the website.</p>
<h3>No Professional Advice</h3>
<p>The content on this website does not constitute professional advice, including but not limited to legal, financial, or technical advice. You should consult qualified professionals before making decisions based on any information provided on this website.</p>
<h3>Project Outcomes</h3>
<p>Cylio does not guarantee specific business outcomes, revenue increases, search engine rankings, or other results from the use of our services. Results depend on many factors outside of our control, including but not limited to market conditions, client implementation, and third-party platforms.</p>
<h3>Third-Party Links</h3>
<p>Our website may contain links to third-party websites or services. These links are provided for convenience only, and Cylio does not endorse or assume responsibility for the content, privacy policies, or practices of any third-party websites.</p>
<h3>Limitation of Liability</h3>
<p>To the fullest extent permitted by applicable law, Cylio shall not be liable for any loss or damage arising out of or in connection with the use of this website or reliance on any information provided herein.</p>
<h3>Errors and Omissions</h3>
<p>Despite our best efforts, the information on this website may contain errors, omissions, or inaccuracies. Cylio reserves the right to make changes, corrections, or updates at any time without notice.</p>
<h3>Related Policies</h3>
<p>Please also review our <a href="/terms-of-service/">Terms of Service</a> for the full terms governing your use of our website and services.</p>
${contactBlock()}`;
}

function getFulfillmentContent() {
  return `<h2>Fulfillment Policy</h2>
${lastUpdated()}
<p>This Fulfillment Policy describes how Cylio LLC ("Cylio") delivers services and project work to clients.</p>
<h3>Nature of Services</h3>
<p>Cylio provides digital services including web design, web development, branding, graphic design, and related creative work. All services are delivered digitally. There are no physical goods shipped as part of our standard service offerings.</p>
<h3>Delivery Process</h3>
<p>Service delivery follows the process outlined in the applicable project agreement:</p>
<ul>
<li><strong>Discovery & Planning:</strong> Initial consultation, requirements gathering, and project scoping</li>
<li><strong>Design & Development:</strong> Creative work, iterations, and milestone reviews</li>
<li><strong>Review & Revision:</strong> Client feedback and revisions as defined in the project scope</li>
<li><strong>Delivery & Handoff:</strong> Final deliverables provided via agreed-upon channels (file sharing, deployment, etc.)</li>
</ul>
<h3>Estimated Timelines</h3>
<p>Project timelines are estimated in the project agreement and depend on the scope and complexity of the work. Cylio makes reasonable efforts to meet agreed-upon deadlines. However, timelines may be adjusted due to scope changes, client delays in providing materials or feedback, or unforeseen circumstances.</p>
<h3>Client Responsibilities</h3>
<p>Timely fulfillment depends on client cooperation, including:</p>
<ul>
<li>Providing required content, assets, and information on schedule</li>
<li>Responding to feedback requests and approvals within agreed timeframes</li>
<li>Communicating scope changes or concerns promptly</li>
</ul>
<h3>Revisions</h3>
<p>The number and scope of revisions included in each project are defined in the project agreement. Additional revisions beyond the agreed scope may be subject to additional fees.</p>
<h3>Delays and Force Majeure</h3>
<p>Cylio shall not be held responsible for delays caused by circumstances beyond our reasonable control, including but not limited to natural disasters, infrastructure failures, or actions by third-party service providers.</p>
<h3>Acceptance</h3>
<p>Deliverables are considered accepted upon written approval by the client, or if no objection is raised within the review period specified in the project agreement.</p>
<h3>Related Policies</h3>
<p>Please also review our <a href="/support-policy/">Support Policy</a> and <a href="/terms-of-service/">Terms of Service</a>.</p>
${contactBlock()}`;
}

function getSupportContent() {
  return `<h2>Support Policy</h2>
${lastUpdated()}
<p>This Support Policy outlines how Cylio LLC ("Cylio") provides support to clients and website visitors.</p>
<h3>Support Channels</h3>
<p>You can reach our support team through the following channels:</p>
<ul>
<li><strong>Email:</strong> <a href="mailto:support@cylio.io">support@cylio.io</a></li>
<li><strong>Phone:</strong> <a href="tel:+17187817927">+1 (718) 781-7927</a></li>
<li><strong>Contact Form:</strong> Available on our <a href="/contact-us/">Contact Us</a> page</li>
</ul>
<h3>Support Hours</h3>
<p>Our team is generally available during standard business hours, Monday through Friday, Eastern Time. We are closed on major United States holidays. Response times may vary outside of business hours.</p>
<h3>Response Times</h3>
<p>We aim to acknowledge all inquiries within one (1) to two (2) business days. Resolution times vary depending on the nature and complexity of the request. Active project clients may have specific response time commitments as defined in their project agreement.</p>
<h3>Scope of Support</h3>
<p>Our support covers:</p>
<ul>
<li>General inquiries about our services</li>
<li>Project-related questions and communications for active clients</li>
<li>Billing and account inquiries</li>
<li>Technical support for deliverables within the warranty or support period defined in the project agreement</li>
</ul>
<h3>Out of Scope</h3>
<p>Support does not typically include:</p>
<ul>
<li>Services, features, or modifications not covered by the project agreement</li>
<li>Third-party software or platforms not provided by Cylio</li>
<li>Issues resulting from unauthorized modifications to deliverables</li>
</ul>
<h3>Escalation</h3>
<p>If your inquiry is not resolved to your satisfaction, you may request escalation by emailing <a href="mailto:support@cylio.io">support@cylio.io</a> with "Escalation Request" in the subject line. For formal complaints, please see our <a href="/complaint-resolution/">Complaint Resolution</a> page.</p>
<h3>Related Policies</h3>
<p>Please also review our <a href="/complaint-resolution/">Complaint Resolution</a> and <a href="/fulfillment-policy/">Fulfillment Policy</a>.</p>
${contactBlock()}`;
}

function getComplaintContent() {
  return `<h2>Complaint Resolution</h2>
${lastUpdated()}
<p>Cylio LLC ("Cylio") is committed to addressing client concerns and complaints promptly and fairly. This policy outlines our process for receiving, investigating, and resolving complaints.</p>
<h3>How to File a Complaint</h3>
<p>If you are dissatisfied with any aspect of our services, please contact us with the details of your complaint:</p>
<ul>
<li><strong>Email:</strong> <a href="mailto:support@cylio.io">support@cylio.io</a> (subject line: "Formal Complaint")</li>
<li><strong>Mail:</strong> Cylio LLC, 1910 Thomes Ave, Cheyenne, WY 82001</li>
</ul>
<h3>Information to Include</h3>
<p>To help us investigate and resolve your complaint efficiently, please include:</p>
<ul>
<li>Your name and contact information</li>
<li>A description of the issue or concern</li>
<li>Relevant dates, project details, or reference numbers</li>
<li>The resolution you are seeking</li>
<li>Any supporting documentation</li>
</ul>
<h3>Acknowledgment</h3>
<p>We will acknowledge receipt of your complaint within two (2) business days.</p>
<h3>Investigation</h3>
<p>Cylio will review the complaint, gather relevant information, and investigate the matter. We may contact you for additional details during the investigation.</p>
<h3>Resolution Timeframes</h3>
<p>We aim to provide a written response with our findings and proposed resolution within ten (10) business days of receiving your complaint. Complex matters may require additional time, in which case we will keep you informed of our progress.</p>
<h3>Escalation</h3>
<p>If you are not satisfied with the initial resolution, you may request a review by a senior member of our team by responding to our resolution with a request for escalation. We will complete the escalation review within an additional ten (10) business days.</p>
<h3>Record Keeping</h3>
<p>Cylio maintains records of all complaints and their resolutions to improve our services and ensure consistent handling of concerns.</p>
<h3>Related Policies</h3>
<p>Please also review our <a href="/support-policy/">Support Policy</a> and <a href="/contact-us/">Contact Us</a> page.</p>
${contactBlock()}`;
}

function getDataRequestContent() {
  return `<h2>Privacy Rights & Data Requests</h2>
${lastUpdated()}
<p>Cylio LLC ("Cylio") respects your right to control your personal information. This page explains the privacy rights available to you and how to exercise them.</p>
<h3>Your Rights</h3>
<p>Depending on your location and applicable law, you may have the following rights regarding your personal information:</p>
<ul>
<li><strong>Right of Access:</strong> You may request a copy of the personal information we hold about you.</li>
<li><strong>Right to Correction:</strong> You may request that we correct inaccurate or incomplete personal information.</li>
<li><strong>Right to Deletion:</strong> You may request that we delete your personal information, subject to certain legal exceptions.</li>
<li><strong>Right to Data Portability:</strong> You may request a copy of your data in a structured, commonly used format.</li>
<li><strong>Right to Opt Out:</strong> You may opt out of certain uses of your personal information, such as marketing communications.</li>
<li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights.</li>
</ul>
<h3>How to Submit a Request</h3>
<p>To exercise any of these rights, please contact us at:</p>
<ul>
<li><strong>Email:</strong> <a href="mailto:support@cylio.io">support@cylio.io</a> (subject line: "Data Request")</li>
<li><strong>Mail:</strong> Cylio LLC, 1910 Thomes Ave, Cheyenne, WY 82001</li>
</ul>
<p>Please include your name, the email address associated with your interactions with Cylio, and a description of your request.</p>
<h3>Verification</h3>
<p>To protect your privacy, we may need to verify your identity before processing your request. We will use reasonable methods to confirm that you are the person whose data is the subject of the request.</p>
<h3>Response Timeframes</h3>
<p>We will acknowledge your request within five (5) business days and aim to fulfill it within thirty (30) calendar days. If we need additional time, we will notify you of the reason and expected completion date.</p>
<h3>Limitations</h3>
<p>In some cases, we may not be able to fully honor a request — for example, if deletion would prevent us from fulfilling a legal obligation, completing a transaction, or if the request is manifestly unfounded or excessive. In such cases, we will explain the reason for our decision.</p>
<h3>Authorized Agents</h3>
<p>You may designate an authorized agent to submit a request on your behalf. We may require the agent to provide proof of authorization and may independently verify your identity.</p>
<h3>Related Policies</h3>
<p>Please also review our <a href="/privacy-policy/">Privacy Policy</a> and <a href="/cookie-policy/">Cookie Policy</a> for additional information about how we collect and use your data.</p>
${contactBlock()}`;
}

function getAccessibilityContent() {
  return `<h2>Accessibility Statement</h2>
${lastUpdated()}
<p>Cylio LLC ("Cylio") is committed to making our website accessible to all users, including individuals with disabilities. We continually work to improve the accessibility and usability of our digital presence.</p>
<h3>Our Commitment</h3>
<p>We strive to ensure that our website conforms to the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA, as a guiding standard. We recognize that accessibility is an ongoing effort, and we are continuously working to improve our website's accessibility.</p>
<h3>Current Accessibility Features</h3>
<p>We have implemented the following features to support accessibility:</p>
<ul>
<li>Semantic HTML markup for improved screen reader compatibility</li>
<li>Alternative text for informational images</li>
<li>Keyboard-navigable interactive elements</li>
<li>Sufficient color contrast for text and important visual elements</li>
<li>Responsive design for various devices and screen sizes</li>
<li>Clear and consistent navigation structure</li>
</ul>
<h3>Known Limitations</h3>
<p>While we strive for full compliance, some content on our website may not yet fully meet all WCAG 2.1 Level AA criteria. We are actively working to identify and address any gaps. Specific known limitations may include:</p>
<ul>
<li>Some older media content may lack complete alternative text descriptions</li>
<li>Certain third-party embedded content may not be fully accessible</li>
</ul>
<h3>Feedback and Assistance</h3>
<p>If you encounter any accessibility barriers on our website, or if you need information in an alternative format, please contact us. We welcome your feedback and will make reasonable efforts to accommodate your needs:</p>
<ul>
<li><strong>Email:</strong> <a href="mailto:support@cylio.io">support@cylio.io</a></li>
<li><strong>Phone:</strong> <a href="tel:+17187817927">+1 (718) 781-7927</a></li>
</ul>
<p>Please include a description of the specific content or feature you found inaccessible, and we will work to address it.</p>
<h3>Third-Party Content</h3>
<p>Our website may include content or features provided by third parties. While we encourage our partners and vendors to provide accessible content, we cannot guarantee the accessibility of third-party content or external websites linked from our site.</p>
<h3>Continuous Improvement</h3>
<p>We are committed to ongoing accessibility improvements and regularly review our website to identify and resolve accessibility issues. This statement will be updated as we make progress.</p>
${contactBlock()}`;
}

function getIPContent() {
  return `<h2>Intellectual Property Notice</h2>
${lastUpdated()}
<p>This notice outlines the intellectual property rights of Cylio LLC ("Cylio") and the terms governing the use of our content, trademarks, and client deliverables.</p>
<h3>Ownership of Website Content</h3>
<p>All content on this website — including text, graphics, logos, images, designs, code, and other materials — is the property of Cylio LLC or its content providers and is protected by applicable intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from our website content without prior written permission.</p>
<h3>Trademarks</h3>
<p>The Cylio name, logo, and related brand elements are trademarks or service marks of Cylio LLC. Use of our trademarks without written permission is prohibited. Other trademarks appearing on this website belong to their respective owners.</p>
<h3>Client Deliverables</h3>
<p>Ownership and licensing of project deliverables (designs, code, assets, etc.) are governed by the applicable project agreement between Cylio and the client. Unless otherwise specified in writing:</p>
<ul>
<li>Upon full payment, clients receive a license or assignment of rights to the final deliverables as outlined in the project agreement</li>
<li>Cylio retains ownership of pre-existing tools, frameworks, templates, and proprietary methodologies used in the creation of deliverables</li>
<li>Cylio may retain the right to display completed work in our portfolio, unless the client requests otherwise in writing</li>
</ul>
<h3>Restrictions on Use</h3>
<p>Without explicit written authorization from Cylio, you may not:</p>
<ul>
<li>Copy, modify, or distribute our website content or proprietary materials</li>
<li>Use our trademarks or brand assets in any manner that implies endorsement or affiliation</li>
<li>Reverse-engineer any software or code provided by Cylio</li>
<li>Resell, sublicense, or redistribute deliverables beyond the scope defined in the project agreement</li>
</ul>
<h3>User-Submitted Content</h3>
<p>Any content you submit to Cylio (text, images, data, etc.) remains your property. By providing content for a project, you grant Cylio a limited license to use it solely for the purpose of fulfilling the project scope.</p>
<h3>Related Policies</h3>
<p>Please also review our <a href="/terms-of-service/">Terms of Service</a> and <a href="/dmca/">DMCA & Copyright</a> page.</p>
${contactBlock()}`;
}

function getDMCAContent() {
  return `<h2>DMCA & Copyright</h2>
${lastUpdated()}
<p>Cylio LLC ("Cylio") respects the intellectual property rights of others. This page explains how to notify us of potential copyright infringement in accordance with the Digital Millennium Copyright Act ("DMCA").</p>
<h3>Filing a DMCA Notice</h3>
<p>If you believe that content on our website infringes your copyright, you may submit a DMCA takedown notice to our designated agent. Your notice must include the following:</p>
<ul>
<li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf</li>
<li>Identification of the copyrighted work claimed to have been infringed</li>
<li>Identification of the material that is claimed to be infringing and its location on our website (e.g., URL)</li>
<li>Your contact information, including name, address, telephone number, and email address</li>
<li>A statement that you have a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law</li>
<li>A statement, made under penalty of perjury, that the information in the notice is accurate and that you are the copyright owner or authorized to act on the owner's behalf</li>
</ul>
<h3>Designated Agent</h3>
<p>DMCA notices should be sent to:</p>
<ul>
<li><strong>Email:</strong> <a href="mailto:support@cylio.io">support@cylio.io</a> (subject line: "DMCA Notice")</li>
<li><strong>Mail:</strong> Cylio LLC, Attn: DMCA Agent, 1910 Thomes Ave, Cheyenne, WY 82001</li>
</ul>
<h3>Counter-Notification</h3>
<p>If you believe that content was removed in error or that you have authorization to use the content, you may submit a counter-notification that includes:</p>
<ul>
<li>Your physical or electronic signature</li>
<li>Identification of the material that was removed and the location where it appeared before removal</li>
<li>A statement under penalty of perjury that you have a good faith belief that the material was removed by mistake or misidentification</li>
<li>Your name, address, and telephone number, and a statement that you consent to the jurisdiction of the federal court in your district</li>
</ul>
<h3>Repeat Infringers</h3>
<p>Cylio will, in appropriate circumstances, terminate the accounts or access of repeat infringers.</p>
<h3>Good Faith</h3>
<p>Please note that submitting a DMCA notice or counter-notification carries legal consequences. Misrepresentation of infringement may result in liability for damages. We recommend consulting legal counsel before submitting a notice.</p>
<h3>Related Policies</h3>
<p>Please also review our <a href="/intellectual-property/">Intellectual Property Notice</a> and <a href="/terms-of-service/">Terms of Service</a>.</p>
${contactBlock()}`;
}

function getSecurityContent() {
  return `<h2>Security & Responsible Disclosure</h2>
${lastUpdated()}
<p>Cylio LLC ("Cylio") takes the security of our systems and client data seriously. This page describes our general security practices and provides guidance for reporting potential vulnerabilities.</p>
<h3>Our Security Practices</h3>
<p>We employ commercially reasonable measures to protect the confidentiality, integrity, and availability of our systems and the data we handle. These measures include but are not limited to:</p>
<ul>
<li>Use of encrypted connections (HTTPS/TLS) for data in transit</li>
<li>Access controls and authentication for internal systems</li>
<li>Regular review and updating of security practices</li>
<li>Limiting data collection to what is necessary for our services</li>
</ul>
<h3>Reporting a Vulnerability</h3>
<p>If you discover a potential security vulnerability on our website or in our systems, we encourage you to report it responsibly. Please contact us at:</p>
<ul>
<li><strong>Email:</strong> <a href="mailto:support@cylio.io">support@cylio.io</a> (subject line: "Security Report")</li>
</ul>
<h3>Responsible Disclosure Guidelines</h3>
<p>We ask that researchers:</p>
<ul>
<li>Provide a clear description of the vulnerability, including steps to reproduce it</li>
<li>Allow us reasonable time to investigate and address the issue before any public disclosure</li>
<li>Avoid accessing, modifying, or deleting data belonging to other users</li>
<li>Do not perform denial-of-service attacks, social engineering, or other disruptive testing</li>
<li>Act in good faith and comply with all applicable laws</li>
</ul>
<h3>What to Expect</h3>
<p>After receiving your report, we will:</p>
<ul>
<li>Acknowledge receipt within three (3) business days</li>
<li>Investigate and assess the reported vulnerability</li>
<li>Work to remediate confirmed vulnerabilities in a timely manner</li>
<li>Keep you informed of our progress if you have provided contact information</li>
</ul>
<h3>Scope</h3>
<p>This policy applies to the Cylio website and any systems directly operated by Cylio LLC. Third-party services, plugins, or platforms are outside the scope of this policy.</p>
<h3>Related Policies</h3>
<p>Please also review our <a href="/privacy-policy/">Privacy Policy</a> and <a href="/contact-us/">Contact Us</a> page.</p>
${contactBlock()}`;
}

function getCommunicationContent() {
  return `<h2>Communication Policy</h2>
${lastUpdated()}
<p>This Communication Policy describes how Cylio LLC ("Cylio") communicates with clients, prospective clients, and website visitors.</p>
<h3>Types of Communications</h3>
<p>You may receive the following types of communications from Cylio:</p>
<ul>
<li><strong>Transactional:</strong> Messages related to active projects, invoices, deliverables, account activity, and service updates</li>
<li><strong>Support:</strong> Responses to your inquiries, support tickets, or feedback</li>
<li><strong>Informational:</strong> Occasional updates about our services, company news, or relevant industry information</li>
</ul>
<h3>Communication Channels</h3>
<p>We primarily communicate via:</p>
<ul>
<li><strong>Email:</strong> Our primary communication channel for all business correspondence</li>
<li><strong>Phone:</strong> For scheduled calls, urgent project matters, or at the client's request</li>
</ul>
<h3>Frequency</h3>
<p>Transactional and support communications are sent as needed based on project activity and your inquiries. Informational communications, if any, are sent infrequently and only when relevant.</p>
<h3>Opt-Out</h3>
<p>You may opt out of informational communications at any time by:</p>
<ul>
<li>Clicking the "unsubscribe" link in any marketing email</li>
<li>Emailing <a href="mailto:support@cylio.io">support@cylio.io</a> with the subject line "Unsubscribe"</li>
</ul>
<p>Please note that transactional and support communications related to active projects or account activity cannot be opted out of while the engagement is active, as they are necessary for service delivery.</p>
<h3>Do Not Contact</h3>
<p>If you wish to cease all non-essential communications from Cylio, please contact us at <a href="mailto:support@cylio.io">support@cylio.io</a> and we will honor your request promptly.</p>
<h3>Related Policies</h3>
<p>Please also review our <a href="/privacy-policy/">Privacy Policy</a> and <a href="/data-request/">Privacy Rights & Data Requests</a> page.</p>
${contactBlock()}`;
}

// ─── Run Generator ──────────────────────────────────────────────────

let created = 0;
for (const page of pages) {
  const dir = path.join(ROOT, page.slug);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const html = generatePage(page);
  const filePath = path.join(dir, 'index.html');
  fs.writeFileSync(filePath, html, 'utf-8');
  created++;
  console.log(`[${created}/${pages.length}] Created: ${page.slug}/index.html`);
}

console.log(`\nDone! Created ${created} pages.`);
