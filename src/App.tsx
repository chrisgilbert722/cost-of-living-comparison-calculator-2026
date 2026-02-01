import { useState } from 'react';

interface CostInput {
    currentCity: string;
    destinationCity: string;
    salary: number;
    housingPreference: 'rent' | 'own';
}

// Cost of living index data (US average = 100)
const CITY_DATA: Record<string, { index: number; housing: number; utilities: number; transport: number; groceries: number }> = {
    'new_york': { index: 187, housing: 280, utilities: 115, transport: 130, groceries: 110 },
    'san_francisco': { index: 179, housing: 260, utilities: 105, transport: 125, groceries: 115 },
    'los_angeles': { index: 166, housing: 230, utilities: 100, transport: 135, groceries: 105 },
    'boston': { index: 152, housing: 195, utilities: 120, transport: 115, groceries: 105 },
    'seattle': { index: 149, housing: 190, utilities: 95, transport: 120, groceries: 110 },
    'miami': { index: 128, housing: 150, utilities: 105, transport: 110, groceries: 105 },
    'denver': { index: 128, housing: 155, utilities: 95, transport: 105, groceries: 100 },
    'chicago': { index: 107, housing: 110, utilities: 100, transport: 115, groceries: 100 },
    'austin': { index: 103, housing: 105, utilities: 100, transport: 100, groceries: 95 },
    'phoenix': { index: 100, housing: 100, utilities: 100, transport: 100, groceries: 100 },
    'atlanta': { index: 98, housing: 95, utilities: 95, transport: 105, groceries: 98 },
    'dallas': { index: 96, housing: 90, utilities: 100, transport: 100, groceries: 95 },
    'houston': { index: 94, housing: 85, utilities: 100, transport: 105, groceries: 95 },
    'nashville': { index: 93, housing: 90, utilities: 95, transport: 95, groceries: 95 },
    'charlotte': { index: 91, housing: 85, utilities: 95, transport: 100, groceries: 95 },
    'indianapolis': { index: 87, housing: 75, utilities: 95, transport: 100, groceries: 95 },
    'kansas_city': { index: 86, housing: 75, utilities: 100, transport: 95, groceries: 95 },
    'columbus': { index: 85, housing: 75, utilities: 90, transport: 95, groceries: 95 },
};

const CITY_LABELS: Record<string, string> = {
    'new_york': 'New York, NY',
    'san_francisco': 'San Francisco, CA',
    'los_angeles': 'Los Angeles, CA',
    'boston': 'Boston, MA',
    'seattle': 'Seattle, WA',
    'miami': 'Miami, FL',
    'denver': 'Denver, CO',
    'chicago': 'Chicago, IL',
    'austin': 'Austin, TX',
    'phoenix': 'Phoenix, AZ',
    'atlanta': 'Atlanta, GA',
    'dallas': 'Dallas, TX',
    'houston': 'Houston, TX',
    'nashville': 'Nashville, TN',
    'charlotte': 'Charlotte, NC',
    'indianapolis': 'Indianapolis, IN',
    'kansas_city': 'Kansas City, MO',
    'columbus': 'Columbus, OH',
};

const COL_TIPS: string[] = [
    'Housing typically accounts for 30-40% of living costs',
    'Tax rates vary significantly between states',
    'Consider commute costs when comparing cities',
    'Remote work may offer more location flexibility'
];

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

function App() {
    const [values, setValues] = useState<CostInput>({ currentCity: 'chicago', destinationCity: 'austin', salary: 75000, housingPreference: 'rent' });
    const handleChange = (field: keyof CostInput, value: string | number) => setValues(prev => ({ ...prev, [field]: value }));

    const currentData = CITY_DATA[values.currentCity];
    const destData = CITY_DATA[values.destinationCity];

    // Calculate cost difference percentage
    const costDifference = ((destData.index - currentData.index) / currentData.index) * 100;
    const isMoreExpensive = costDifference > 0;

    // Estimate monthly costs (based on salary and index)
    const baseMonthly = values.salary / 12;
    const currentMonthlyCost = Math.round(baseMonthly * (currentData.index / 100) * 0.65);
    const destMonthlyCost = Math.round(baseMonthly * (destData.index / 100) * 0.65);

    // Housing adjustment for rent vs own
    const housingMultiplier = values.housingPreference === 'own' ? 1.2 : 1.0;

    // Required salary adjustment
    const requiredSalary = Math.round(values.salary * (destData.index / currentData.index));
    const salaryAdjustment = requiredSalary - values.salary;

    const breakdownData = [
        { label: 'Housing Index', current: currentData.housing * housingMultiplier, dest: destData.housing * housingMultiplier },
        { label: 'Utilities Index', current: currentData.utilities, dest: destData.utilities },
        { label: 'Transportation Index', current: currentData.transport, dest: destData.transport },
        { label: 'Groceries Index', current: currentData.groceries, dest: destData.groceries },
        { label: 'Overall Index', current: currentData.index, dest: destData.index, isTotal: true },
    ];

    return (
        <main style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <header style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
                <h1 style={{ marginBottom: 'var(--space-2)' }}>Cost of Living Comparison (2026)</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>Compare estimated living costs between cities</p>
            </header>

            <div className="card">
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="currentCity">Current City</label>
                            <select id="currentCity" value={values.currentCity} onChange={(e) => handleChange('currentCity', e.target.value)}>
                                {Object.entries(CITY_LABELS).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="destinationCity">Destination City</label>
                            <select id="destinationCity" value={values.destinationCity} onChange={(e) => handleChange('destinationCity', e.target.value)}>
                                {Object.entries(CITY_LABELS).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="salary">Annual Salary ($)</label>
                            <input id="salary" type="number" min="20000" max="500000" step="5000" value={values.salary || ''} onChange={(e) => handleChange('salary', parseInt(e.target.value) || 0)} placeholder="75000" />
                        </div>
                        <div>
                            <label htmlFor="housingPreference">Housing Preference</label>
                            <select id="housingPreference" value={values.housingPreference} onChange={(e) => handleChange('housingPreference', e.target.value)}>
                                <option value="rent">Renting</option>
                                <option value="own">Owning</option>
                            </select>
                        </div>
                    </div>
                    <button className="btn-primary" type="button">Compare Cities</button>
                </div>
            </div>

            <div className="card results-panel">
                <div className="text-center">
                    <h2 className="result-label" style={{ marginBottom: 'var(--space-2)' }}>Cost of Living Difference</h2>
                    <div className="result-hero" style={{ color: isMoreExpensive ? '#DC2626' : '#16A34A' }}>
                        {isMoreExpensive ? '+' : ''}{costDifference.toFixed(1)}%
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
                        {CITY_LABELS[values.destinationCity]} vs {CITY_LABELS[values.currentCity]}
                    </div>
                </div>
                <hr className="result-divider" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', textAlign: 'center' }}>
                    <div>
                        <div className="result-label">Monthly Cost (Current)</div>
                        <div className="result-value">{fmt(currentMonthlyCost)}</div>
                    </div>
                    <div style={{ borderLeft: '1px solid #BAE6FD', paddingLeft: 'var(--space-4)' }}>
                        <div className="result-label">Monthly Cost (Dest)</div>
                        <div className="result-value">{fmt(destMonthlyCost)}</div>
                    </div>
                </div>
                <div style={{ marginTop: 'var(--space-4)', textAlign: 'center', padding: 'var(--space-3)', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-md)' }}>
                    <div className="result-label">Required Salary Adjustment</div>
                    <div className="result-value" style={{ color: salaryAdjustment > 0 ? '#DC2626' : '#16A34A' }}>
                        {salaryAdjustment > 0 ? '+' : ''}{fmt(salaryAdjustment)}
                    </div>
                </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-4)' }}>Key Considerations</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
                    {COL_TIPS.map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', flexShrink: 0 }} />{item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="ad-container"><span>Advertisement</span></div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1rem' }}>Index Comparison (US Avg = 100)</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>Category</th>
                            <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', color: 'var(--color-text-secondary)' }}>Current</th>
                            <th style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'right', color: 'var(--color-text-secondary)' }}>Dest</th>
                        </tr>
                    </thead>
                    <tbody>
                        {breakdownData.map((row, i) => (
                            <tr key={i} style={{ borderBottom: i === breakdownData.length - 1 ? 'none' : '1px solid var(--color-border)', backgroundColor: row.isTotal ? '#F0F9FF' : (i % 2 ? '#F8FAFC' : 'transparent') }}>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', color: 'var(--color-text-secondary)', fontWeight: row.isTotal ? 600 : 400 }}>{row.label}</td>
                                <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', fontWeight: 600 }}>{Math.round(row.current)}</td>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'right', fontWeight: 600, color: row.isTotal ? 'var(--color-primary)' : (row.dest > row.current ? '#DC2626' : '#16A34A') }}>{Math.round(row.dest)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <p>This calculator provides estimates of relative cost of living differences between cities using index-based comparisons. Actual costs depend on individual lifestyle, neighborhood, and spending habits. The figures shown are estimates only and do not account for taxes, healthcare, or personal circumstances. Research specific costs and visit locations before making relocation decisions.</p>
            </div>

            <footer style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-8)' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', fontSize: '0.875rem' }}>
                    <li>• Estimates only</li><li>• Simplified assumptions</li><li>• Free to use</li>
                </ul>
                <nav style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
                    <a href="https://scenariocalculators.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Privacy Policy</a>
                    <span style={{ color: '#64748B' }}>|</span>
                    <a href="https://scenariocalculators.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Terms of Service</a>
                </nav>
                <p style={{ marginTop: 'var(--space-4)', fontSize: '0.75rem' }}>&copy; 2026 Cost of Living Calculator</p>
            </footer>

            <div className="ad-container ad-sticky"><span>Advertisement</span></div>
        </main>
    );
}

export default App;
