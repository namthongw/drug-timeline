export const CATEGORY_ORDER = [
  'Corticosteroids',
  'Immunosuppressives',
  'Biologics',
  'Antibiotics – Tetracyclines',
  'Antibiotics – Macrolides',
  'Antibiotics – Penicillins',
  'Antibiotics – Fluoroquinolones',
  'Antibiotics – Others',
  'Antivirals',
  'Antifungals',
  'Antiparasitics',
  'Antihistamines',
  'NSAIDs / Analgesics',
  'Colchicine & gout drugs',
  'Intravenous immunoglobulin',
  'Phototherapy',
  'Retinoids',
  'Others',
];

export const CATEGORY_COLORS = {
  'Corticosteroids':                '#16a34a',
  'Immunosuppressives':             '#2563eb',
  'Biologics':                      '#0ea5e9',
  'Antibiotics – Tetracyclines':    '#0f766e',
  'Antibiotics – Macrolides':       '#0369a1',
  'Antibiotics – Penicillins':      '#1d4ed8',
  'Antibiotics – Fluoroquinolones': '#4f46e5',
  'Antibiotics – Others':           '#6d28d9',
  'Antivirals':                     '#b45309',
  'Antifungals':                    '#15803d',
  'Antiparasitics':                 '#92400e',
  'Antihistamines':                 '#be185d',
  'NSAIDs / Analgesics':            '#9f1239',
  'Colchicine & gout drugs':        '#7c3aed',
  'Intravenous immunoglobulin':     '#0c4a6e',
  'Phototherapy':                   '#854d0e',
  'Retinoids':                      '#c2410c',
  'Others':                         '#475569',
};

export const DRUG_DATABASE = {
  // ── Corticosteroids ──────────────────────────────────────────────
  'Prednisolone': {
    category: 'Corticosteroids',
    doses: ['2.5mg', '5mg', '10mg', '15mg', '20mg', '25mg', '30mg', '40mg', '60mg', '80mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },
  'Dexamethasone': {
    category: 'Corticosteroids',
    doses: ['0.5mg', '1mg', '2mg', '4mg', '8mg', '12mg', '16mg', '20mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)', 'Intramuscular (IM)'],
  },
  'Methylprednisolone': {
    category: 'Corticosteroids',
    doses: ['4mg', '8mg', '16mg', '32mg', '64mg', '125mg', '500mg', '1000mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)', 'Intramuscular (IM)'],
  },
  'Triamcinolone': {
    category: 'Corticosteroids',
    doses: ['4mg', '8mg', '10mg', '40mg', '80mg'],
    routes: ['Oral (PO)', 'Intramuscular (IM)', 'Intralesional'],
  },
  'Triamcinolone acetonide (injection)': {
    category: 'Corticosteroids',
    doses: ['10mg', '20mg', '40mg', '80mg'],
    routes: ['Intramuscular (IM)', 'Intralesional', 'Intraarticular'],
  },
  'Betamethasone': {
    category: 'Corticosteroids',
    doses: ['0.5mg', '1mg', '2mg', '4mg', '8mg'],
    routes: ['Oral (PO)', 'Intramuscular (IM)', 'Intralesional'],
  },
  'Hydrocortisone': {
    category: 'Corticosteroids',
    doses: ['10mg', '20mg', '50mg', '100mg', '200mg', '500mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)', 'Intramuscular (IM)'],
  },
  'Deflazacort': {
    category: 'Corticosteroids',
    doses: ['1mg', '6mg', '12mg', '18mg', '24mg', '30mg'],
    routes: ['Oral (PO)'],
  },

  // ── Immunosuppressives ───────────────────────────────────────────
  'Methotrexate': {
    category: 'Immunosuppressives',
    doses: ['5mg', '7.5mg', '10mg', '12.5mg', '15mg', '17.5mg', '20mg', '25mg'],
    routes: ['Oral (PO)', 'Subcutaneous (SC)', 'Intramuscular (IM)', 'Intravenous (IV)'],
  },
  'Azathioprine': {
    category: 'Immunosuppressives',
    doses: ['25mg', '50mg', '75mg', '100mg', '125mg', '150mg', '200mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },
  'Cyclosporine': {
    category: 'Immunosuppressives',
    doses: ['25mg', '50mg', '75mg', '100mg', '150mg', '200mg', '250mg', '300mg', '400mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },
  'Mycophenolate': {
    category: 'Immunosuppressives',
    doses: ['250mg', '500mg', '750mg', '1000mg', '1500mg', '2000mg', '3000mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },
  'Hydroxychloroquine': {
    category: 'Immunosuppressives',
    doses: ['100mg', '200mg', '300mg', '400mg'],
    routes: ['Oral (PO)'],
  },
  'Tacrolimus (systemic)': {
    category: 'Immunosuppressives',
    doses: ['0.5mg', '1mg', '2mg', '3mg', '5mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },
  'Sirolimus': {
    category: 'Immunosuppressives',
    doses: ['0.5mg', '1mg', '2mg', '5mg'],
    routes: ['Oral (PO)'],
  },
  'Leflunomide': {
    category: 'Immunosuppressives',
    doses: ['10mg', '20mg', '100mg (loading)'],
    routes: ['Oral (PO)'],
  },
  'Rituximab': {
    category: 'Immunosuppressives',
    doses: ['100mg', '375mg/m²', '500mg', '1000mg'],
    routes: ['Intravenous (IV)', 'Subcutaneous (SC)'],
  },

  // ── Biologics ────────────────────────────────────────────────────
  'Dupilumab': {
    category: 'Biologics',
    doses: ['200mg', '300mg', '600mg (loading)'],
    routes: ['Subcutaneous (SC)'],
  },
  'Secukinumab': {
    category: 'Biologics',
    doses: ['150mg', '300mg'],
    routes: ['Subcutaneous (SC)', 'Intravenous (IV)'],
  },
  'Ixekizumab': {
    category: 'Biologics',
    doses: ['80mg', '160mg (loading)'],
    routes: ['Subcutaneous (SC)'],
  },
  'Adalimumab': {
    category: 'Biologics',
    doses: ['40mg', '80mg'],
    routes: ['Subcutaneous (SC)'],
  },
  'Ustekinumab': {
    category: 'Biologics',
    doses: ['45mg', '90mg'],
    routes: ['Subcutaneous (SC)', 'Intravenous (IV)'],
  },
  'Omalizumab': {
    category: 'Biologics',
    doses: ['75mg', '150mg', '300mg'],
    routes: ['Subcutaneous (SC)'],
  },
  'Baricitinib': {
    category: 'Biologics',
    doses: ['1mg', '2mg', '4mg'],
    routes: ['Oral (PO)'],
  },
  'Upadacitinib': {
    category: 'Biologics',
    doses: ['7.5mg', '15mg', '30mg'],
    routes: ['Oral (PO)'],
  },
  'Abrocitinib': {
    category: 'Biologics',
    doses: ['50mg', '100mg', '200mg'],
    routes: ['Oral (PO)'],
  },
  'Tralokinumab': {
    category: 'Biologics',
    doses: ['150mg', '300mg (loading)'],
    routes: ['Subcutaneous (SC)'],
  },
  'Lebrikizumab': {
    category: 'Biologics',
    doses: ['125mg', '250mg (loading)'],
    routes: ['Subcutaneous (SC)'],
  },
  'Spesolimab': {
    category: 'Biologics',
    doses: ['300mg', '600mg (loading)'],
    routes: ['Intravenous (IV)', 'Subcutaneous (SC)'],
  },
  'Bimekizumab': {
    category: 'Biologics',
    doses: ['160mg', '320mg (loading)'],
    routes: ['Subcutaneous (SC)'],
  },
  'Risankizumab': {
    category: 'Biologics',
    doses: ['150mg', '600mg (loading IV)'],
    routes: ['Subcutaneous (SC)', 'Intravenous (IV)'],
  },
  'Guselkumab': {
    category: 'Biologics',
    doses: ['100mg'],
    routes: ['Subcutaneous (SC)'],
  },
  'Tildrakizumab': {
    category: 'Biologics',
    doses: ['100mg', '200mg'],
    routes: ['Subcutaneous (SC)'],
  },

  // ── Antibiotics – Tetracyclines ──────────────────────────────────
  'Doxycycline': {
    category: 'Antibiotics – Tetracyclines',
    doses: ['50mg', '100mg', '200mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },
  'Minocycline': {
    category: 'Antibiotics – Tetracyclines',
    doses: ['50mg', '100mg', '200mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },
  'Lymecycline': {
    category: 'Antibiotics – Tetracyclines',
    doses: ['300mg', '408mg'],
    routes: ['Oral (PO)'],
  },

  // ── Antibiotics – Macrolides ─────────────────────────────────────
  'Azithromycin': {
    category: 'Antibiotics – Macrolides',
    doses: ['250mg', '500mg', '1000mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },
  'Clarithromycin': {
    category: 'Antibiotics – Macrolides',
    doses: ['250mg', '500mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },

  // ── Antibiotics – Penicillins ────────────────────────────────────
  'Amoxicillin': {
    category: 'Antibiotics – Penicillins',
    doses: ['250mg', '500mg', '875mg', '1000mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },
  'Amoxicillin-clavulanate': {
    category: 'Antibiotics – Penicillins',
    doses: ['375mg', '625mg', '1000mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },

  // ── Antibiotics – Fluoroquinolones ───────────────────────────────
  'Ciprofloxacin': {
    category: 'Antibiotics – Fluoroquinolones',
    doses: ['250mg', '500mg', '750mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },
  'Levofloxacin': {
    category: 'Antibiotics – Fluoroquinolones',
    doses: ['250mg', '500mg', '750mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },

  // ── Antibiotics – Others ─────────────────────────────────────────
  'Clindamycin': {
    category: 'Antibiotics – Others',
    doses: ['150mg', '300mg', '450mg', '600mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)', 'Intramuscular (IM)'],
  },
  'Dapsone': {
    category: 'Antibiotics – Others',
    doses: ['25mg', '50mg', '100mg'],
    routes: ['Oral (PO)'],
  },
  'Co-trimoxazole': {
    category: 'Antibiotics – Others',
    doses: ['240mg', '480mg', '960mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },
  'Rifampicin': {
    category: 'Antibiotics – Others',
    doses: ['150mg', '300mg', '450mg', '600mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },
  'Trimethoprim': {
    category: 'Antibiotics – Others',
    doses: ['100mg', '200mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },
  'Metronidazole': {
    category: 'Antibiotics – Others',
    doses: ['200mg', '400mg', '500mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)', 'Topical'],
  },
  'Fusidic acid': {
    category: 'Antibiotics – Others',
    doses: ['250mg', '500mg', '750mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)', 'Topical'],
  },
  'Cefadroxil': {
    category: 'Antibiotics – Others',
    doses: ['500mg', '1000mg'],
    routes: ['Oral (PO)'],
  },
  'Cephalexin': {
    category: 'Antibiotics – Others',
    doses: ['250mg', '500mg', '1000mg'],
    routes: ['Oral (PO)'],
  },

  // ── Antivirals ───────────────────────────────────────────────────
  'Acyclovir': {
    category: 'Antivirals',
    doses: ['200mg', '400mg', '800mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)', 'Topical'],
  },
  'Valacyclovir': {
    category: 'Antivirals',
    doses: ['500mg', '1000mg'],
    routes: ['Oral (PO)'],
  },
  'Famciclovir': {
    category: 'Antivirals',
    doses: ['125mg', '250mg', '500mg'],
    routes: ['Oral (PO)'],
  },
  'Oseltamivir': {
    category: 'Antivirals',
    doses: ['30mg', '45mg', '75mg'],
    routes: ['Oral (PO)'],
  },
  'Penciclovir': {
    category: 'Antivirals',
    doses: ['1% cream'],
    routes: ['Topical'],
  },

  // ── Antifungals ──────────────────────────────────────────────────
  'Fluconazole': {
    category: 'Antifungals',
    doses: ['50mg', '100mg', '150mg', '200mg', '400mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },
  'Itraconazole': {
    category: 'Antifungals',
    doses: ['100mg', '200mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },
  'Terbinafine': {
    category: 'Antifungals',
    doses: ['125mg', '250mg'],
    routes: ['Oral (PO)', 'Topical'],
  },
  'Griseofulvin': {
    category: 'Antifungals',
    doses: ['125mg', '250mg', '500mg'],
    routes: ['Oral (PO)'],
  },
  'Voriconazole': {
    category: 'Antifungals',
    doses: ['50mg', '100mg', '200mg', '300mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },
  'Posaconazole': {
    category: 'Antifungals',
    doses: ['100mg', '200mg', '300mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },
  'Nystatin': {
    category: 'Antifungals',
    doses: ['100,000 IU', '500,000 IU'],
    routes: ['Oral (PO)', 'Topical'],
  },
  'Clotrimazole (systemic)': {
    category: 'Antifungals',
    doses: ['10mg', '20mg'],
    routes: ['Oral (PO)'],
  },

  // ── Antiparasitics ───────────────────────────────────────────────
  'Ivermectin': {
    category: 'Antiparasitics',
    doses: ['3mg', '6mg', '12mg'],
    routes: ['Oral (PO)', 'Topical'],
  },
  'Albendazole': {
    category: 'Antiparasitics',
    doses: ['200mg', '400mg'],
    routes: ['Oral (PO)'],
  },
  'Permethrin (systemic use)': {
    category: 'Antiparasitics',
    doses: ['5% cream', '1% lotion'],
    routes: ['Topical'],
  },

  // ── Antihistamines ───────────────────────────────────────────────
  'Cetirizine': {
    category: 'Antihistamines',
    doses: ['5mg', '10mg'],
    routes: ['Oral (PO)'],
  },
  'Loratadine': {
    category: 'Antihistamines',
    doses: ['5mg', '10mg'],
    routes: ['Oral (PO)'],
  },
  'Fexofenadine': {
    category: 'Antihistamines',
    doses: ['60mg', '120mg', '180mg'],
    routes: ['Oral (PO)'],
  },
  'Hydroxyzine': {
    category: 'Antihistamines',
    doses: ['10mg', '25mg', '50mg', '75mg', '100mg'],
    routes: ['Oral (PO)', 'Intramuscular (IM)'],
  },
  'Chlorpheniramine': {
    category: 'Antihistamines',
    doses: ['2mg', '4mg', '8mg', '12mg'],
    routes: ['Oral (PO)', 'Intramuscular (IM)', 'Intravenous (IV)'],
  },
  'Bilastine': {
    category: 'Antihistamines',
    doses: ['10mg', '20mg'],
    routes: ['Oral (PO)'],
  },
  'Rupatadine': {
    category: 'Antihistamines',
    doses: ['10mg', '20mg'],
    routes: ['Oral (PO)'],
  },

  // ── NSAIDs / Analgesics ──────────────────────────────────────────
  'Ibuprofen': {
    category: 'NSAIDs / Analgesics',
    doses: ['200mg', '400mg', '600mg', '800mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)'],
  },
  'Naproxen': {
    category: 'NSAIDs / Analgesics',
    doses: ['250mg', '375mg', '500mg'],
    routes: ['Oral (PO)'],
  },
  'Diclofenac': {
    category: 'NSAIDs / Analgesics',
    doses: ['25mg', '50mg', '75mg', '100mg'],
    routes: ['Oral (PO)', 'Intramuscular (IM)', 'Topical'],
  },
  'Celecoxib': {
    category: 'NSAIDs / Analgesics',
    doses: ['100mg', '200mg', '400mg'],
    routes: ['Oral (PO)'],
  },
  'Paracetamol': {
    category: 'NSAIDs / Analgesics',
    doses: ['500mg', '650mg', '1000mg'],
    routes: ['Oral (PO)', 'Intravenous (IV)', 'Rectal'],
  },

  // ── Colchicine & gout drugs ──────────────────────────────────────
  'Colchicine': {
    category: 'Colchicine & gout drugs',
    doses: ['0.5mg', '1mg'],
    routes: ['Oral (PO)'],
  },
  'Allopurinol': {
    category: 'Colchicine & gout drugs',
    doses: ['100mg', '200mg', '300mg', '400mg', '600mg'],
    routes: ['Oral (PO)'],
  },
  'Febuxostat': {
    category: 'Colchicine & gout drugs',
    doses: ['40mg', '80mg', '120mg'],
    routes: ['Oral (PO)'],
  },

  // ── Intravenous immunoglobulin ───────────────────────────────────
  'IVIG': {
    category: 'Intravenous immunoglobulin',
    doses: ['0.4g/kg', '1g/kg', '2g/kg'],
    routes: ['Intravenous (IV)'],
  },

  // ── Phototherapy ─────────────────────────────────────────────────
  'NB-UVB': {
    category: 'Phototherapy',
    doses: ['Initial dose', 'Maintenance dose'],
    routes: ['Phototherapy'],
  },
  'PUVA': {
    category: 'Phototherapy',
    doses: ['8-MOP 0.4mg/kg', 'Bath PUVA'],
    routes: ['Phototherapy'],
  },

  // ── Retinoids ────────────────────────────────────────────────────
  'Isotretinoin': {
    category: 'Retinoids',
    doses: ['5mg', '10mg', '20mg', '30mg', '40mg'],
    routes: ['Oral (PO)'],
  },
  'Acitretin': {
    category: 'Retinoids',
    doses: ['10mg', '25mg', '50mg'],
    routes: ['Oral (PO)'],
  },
};

export const ALL_DRUG_NAMES = Object.keys(DRUG_DATABASE).sort();

export function getDrugInfo(name) {
  return DRUG_DATABASE[name] ?? { category: 'Others', doses: [], routes: ['Oral (PO)'] };
}

export function getDrugColor(category) {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS['Others'];
}
