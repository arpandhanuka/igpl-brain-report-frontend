// prompts.ts — one authoritative prompt per page
// Each is sent to POST /api/brain/query with mode=agent

export const PAGES = [
  { id: 'command',     label: 'Command',     icon: '⚡' },
  { id: 'pa1',         label: 'PA1',         icon: '🏭' },
  { id: 'pa2',         label: 'PA2',         icon: '🏭' },
  { id: 'pa3',         label: 'PA3',         icon: '🏭' },
  { id: 'pa4',         label: 'PA4',         icon: '🏭' },
  { id: 'pa5',         label: 'PA5',         icon: '🏭' },
  { id: 'sales',       label: 'Sales',       icon: '📦' },
  { id: 'finance',     label: 'Finance',     icon: '💰' },
  { id: 'procurement', label: 'Procurement', icon: '🔗' },
]

export const PROMPTS: Record<string, string> = {
  command: `Today is {DATE}. Provide a comprehensive, high-level summary of IGPL's current business state, highlighting any immediate critical issues or opportunities. Cover:
1. OVERALL STATUS: Are all PA plants running? Any significant operational disruptions or scheduled shutdowns?
2. TOP-LINE COMMERCIAL: Today's PA dispatch volume and estimated revenue. How does this compare to target and past performance (this day last month)?
3. INVENTORY HEALTH: Current inventory and days cover for key products (PA, OX, MA). Note any stockout risks or excess.
4. CRITICAL ALERTS: Summarize all active critical alerts across any business lens (operational, commercial, financial). What is the single most important actionable insight right now?
5. FORWARD-LOOKING RISKS: Any immediate projections of stockouts or critical credit breaches.
6. OVERALL CONFIDENCE: A one-sentence summary of the overall business health.
Be concise. Prioritize actionability. Include specific numbers and comparison points to yesterday or target where possible.`,

  pa1: `Today is {DATE}. Provide a complete and granular summary for PA1 specifically. Cover:
1. OPERATIONAL STATUS: Is PA1 currently running? Uptime percentage for the last 24 hours. Any recent shutdowns or startups?
2. PRODUCTION PERFORMANCE: Today's PA production (MT), actual vs target. Production rate and efficiency.
3. OX LOADING: Current OX loading (g/Nm3) at PA1 vs optimal target of 95 g/Nm3. The last 24h trend.
4. KEY PROCESS PARAMETERS: Latest readings for reactor temperature, pressure, and major flow rates. Flag any deviations from normal operating ranges.
5. UTILITIES CONSUMPTION: Current steam, power, and cooling water consumption at PA1. Compare to typical usage for current production.
6. CATALYST HEALTH: Latest catalyst activity or differential pressure across the reactor. Estimated remaining catalyst life or next changeover.
7. ALERTS & ISSUES: All active alerts (critical, warning) specific to PA1. Open issues or recent maintenance events impacting PA1, including scope keys and status.
8. MAINTENANCE INSIGHTS: Pending maintenance work orders, scheduled downtime, or recurrent equipment failures for PA1.
9. SAFETY/ENVIRONMENTAL: Recent EHS incidents or abnormal emissions readings for PA1.
10. FINANCIAL IMPACT: Estimated revenue loss or opportunity cost directly attributable to PA1's operational state today.
Be detailed, numeric, and include valid-from timestamps for all data points. Highlight any anomalies requiring immediate attention.`,

  pa2: `Today is {DATE}. Provide a complete and granular summary for PA2 specifically. Cover:
1. OPERATIONAL STATUS: Is PA2 currently running? Uptime percentage for the last 24 hours. Any recent shutdowns or startups?
2. PRODUCTION PERFORMANCE: Today's PA production (MT), actual vs target. Production rate and efficiency.
3. OX LOADING: Current OX loading (g/Nm3) at PA2 vs optimal target of 95 g/Nm3. The last 24h trend.
4. KEY PROCESS PARAMETERS: Latest readings for reactor temperature, pressure, and major flow rates. Flag any deviations from normal operating ranges.
5. UTILITIES CONSUMPTION: Current steam, power, and cooling water consumption at PA2. Compare to typical usage for current production.
6. CATALYST HEALTH: Latest catalyst activity or differential pressure across the reactor. Estimated remaining catalyst life or next changeover.
7. ALERTS & ISSUES: All active alerts (critical, warning) specific to PA2. Open issues or recent maintenance events impacting PA2, including scope keys and status.
8. MAINTENANCE INSIGHTS: Pending maintenance work orders, scheduled downtime, or recurrent equipment failures for PA2.
9. SAFETY/ENVIRONMENTAL: Recent EHS incidents or abnormal emissions readings for PA2.
10. FINANCIAL IMPACT: Estimated revenue loss or opportunity cost directly attributable to PA2's operational state today.
Be detailed, numeric, and include valid-from timestamps for all data points. Highlight any anomalies requiring immediate attention.`,

  pa3: `Today is {DATE}. Provide a complete and granular summary for PA3 specifically. Cover:
1. OPERATIONAL STATUS: Is PA3 currently running? Uptime percentage for the last 24 hours. Any recent shutdowns or startups?
2. PRODUCTION PERFORMANCE: Today's PA production (MT), actual vs target. Production rate and efficiency.
3. OX LOADING: Current OX loading (g/Nm3) at PA3 vs optimal target of 95 g/Nm3. The last 24h trend.
4. KEY PROCESS PARAMETERS: Latest readings for reactor temperature, pressure, and major flow rates. Flag any deviations from normal operating ranges.
5. UTILITIES CONSUMPTION: Current steam, power, and cooling water consumption at PA3. Compare to typical usage for current production.
6. CATALYST HEALTH: Latest catalyst activity or differential pressure across the reactor. Estimated remaining catalyst life or next changeover.
7. ALERTS & ISSUES: All active alerts (critical, warning) specific to PA3. Open issues or recent maintenance events impacting PA3, including scope keys and status.
8. MAINTENANCE INSIGHTS: Pending maintenance work orders, scheduled downtime, or recurrent equipment failures for PA3.
9. SAFETY/ENVIRONMENTAL: Recent EHS incidents or abnormal emissions readings for PA3.
10. FINANCIAL IMPACT: Estimated revenue loss or opportunity cost directly attributable to PA3's operational state today.
Be detailed, numeric, and include valid-from timestamps for all data points. Highlight any anomalies requiring immediate attention.`,

  pa4: `Today is {DATE}. Provide a complete and granular summary for PA4 specifically. Cover:
1. OPERATIONAL STATUS: Is PA4 currently running? Uptime percentage for the last 24 hours. Any recent shutdowns or startups?
2. PRODUCTION PERFORMANCE: Today's PA production (MT), actual vs target. Production rate and efficiency.
3. OX LOADING: Current OX loading (g/Nm3) at PA4 vs optimal target of 95 g/Nm3. The last 24h trend.
4. KEY PROCESS PARAMETERS: Latest readings for reactor temperature, pressure, and major flow rates. Flag any deviations from normal operating ranges.
5. UTILITIES CONSUMPTION: Current steam, power, and cooling water consumption at PA4. Compare to typical usage for current production.
6. CATALYST HEALTH: Latest catalyst activity or differential pressure across the reactor. Estimated remaining catalyst life or next changeover.
7. ALERTS & ISSUES: All active alerts (critical, warning) specific to PA4. Open issues or recent maintenance events impacting PA4, including scope keys and status.
8. MAINTENANCE INSIGHTS: Pending maintenance work orders, scheduled downtime, or recurrent equipment failures for PA4.
9. SAFETY/ENVIRONMENTAL: Recent EHS incidents or abnormal emissions readings for PA4.
10. FINANCIAL IMPACT: Estimated revenue loss or opportunity cost directly attributable to PA4's operational state today.
Be detailed, numeric, and include valid-from timestamps for all data points. Highlight any anomalies requiring immediate attention.`,

  pa5: `Today is {DATE}. Provide a complete and granular summary for PA5 specifically. Cover:
1. OPERATIONAL STATUS: Is PA5 currently running? Uptime percentage for the last 24 hours. Any recent shutdowns or startups?
2. PRODUCTION PERFORMANCE: Today's PA production (MT), actual vs target. Production rate and efficiency.
3. OX LOADING: Current OX loading (g/Nm3) at PA5 vs optimal target of 95 g/Nm3. The last 24h trend.
4. KEY PROCESS PARAMETERS: Latest readings for reactor temperature, pressure, and major flow rates. Flag any deviations from normal operating ranges.
5. UTILITIES CONSUMPTION: Current steam, power, and cooling water consumption at PA5. Compare to typical usage for current production.
6. CATALYST HEALTH: Latest catalyst activity or differential pressure across the reactor. Estimated remaining catalyst life or next changeover.
7. ALERTS & ISSUES: All active alerts (critical, warning) specific to PA5. Open issues or recent maintenance events impacting PA5, including scope keys and status.
8. MAINTENANCE INSIGHTS: Pending maintenance work orders, scheduled downtime, or recurrent equipment failures for PA5.
9. SAFETY/ENVIRONMENTAL: Recent EHS incidents or abnormal emissions readings for PA5.
10. FINANCIAL IMPACT: Estimated revenue loss or opportunity cost directly attributable to PA5's operational state today.
Be detailed, numeric, and include valid-from timestamps for all data points. Highlight any anomalies requiring immediate attention.`,

  sales: `Today is {DATE}. Provide a detailed overview of IGPL's sales performance for today and Month-to-Date (MTD). Cover:
1. PA DISPATCH: Total PA dispatched volume (MT) for today and MTD. Compare to last month's MTD and the monthly target.
2. REVENUE & NSR: Estimated PA revenue (Rs Lakh) and Net Sales Realization (NSR, Rs/MT) for today and MTD. Use actual line prices from BC sales order dispatch lines.
3. PENDING ORDERS: Summarize value and volume of pending sales orders for all products not yet dispatched, especially those past their requested delivery date.
4. CUSTOMER HEALTH: Identify any key customers with outstanding credit holds, overdue payments, or any customer churn alerts detected by the Brain.
5. CUSTOMER INTELLIGENCE: Summarize the top 3 high-priority customer-related alerts and findings from the Brain.
6. CONTRACT RISK: Any current sales contracts identified as being at risk (volume shortfalls, price disputes).
Include key numbers, comparisons, and list specific entities (customers, contracts) where relevant.`,

  finance: `Today is {DATE}. Summarize IGPL's current financial situation with a focus on liquidity, credit risk, and working capital efficiency. Cover:
1. ACCOUNTS RECEIVABLE: Total outstanding receivables (Rs Lakh). Break down by aging buckets (current, 30-60, 60-90, >90 days overdue). Highlight top 5 customers with largest overdue amounts.
2. ACCOUNTS PAYABLE: Total pending payables (Rs Lakh). Summarize upcoming payments due within the next 7 days.
3. CASH POSITION: Current bank balances and any significant cash flow concerns or projections.
4. CREDIT WATCHDOG ALERTS: List any active credit-related alerts from the Brain, especially those indicating potential customer defaults or internal policy breaches.
5. WORKING CAPITAL: Current working capital status and any flags about working capital traps or inefficiencies.
6. MTD PROFIT/LOSS: Estimated MTD P&L based on dispatches, NSR, and cost data available in the Brain.
Provide accurate figures from BC ERP and detail specific entities (customers, vendors) as needed.`,

  procurement: `Today is {DATE}. Provide a detailed summary of IGPL's procurement landscape, focusing on key raw materials and vendor health. Cover:
1. OX STOCK: Current OX inventory (MT) and calculated days cover. Any immediate stockout risks?
2. OTHER KEY RAW MATERIALS: Current stock levels and days cover for the top 3 other critical raw materials by value.
3. ACTIVE PURCHASE ORDERS: Summarize active purchase orders for OX and top 3 other critical raw materials — quantity, value, and expected delivery.
4. VENDOR RISK: Highlight any vendor risk alerts (poor quality, delivery delays, financial distress) from the Brain. Which vendors are most critical to monitor?
5. PRICING INTELLIGENCE: Compare the latest OX procurement price with current market prices. Summarize any price variance alerts or opportunities.
6. SUPPLY CHAIN RISKS: Any detected supply chain fragilities (single-source dependency, upcoming supply gaps, geopolitical risks).
List relevant vendors, products, and provide numeric context for stock, days cover, and prices.`,
}
