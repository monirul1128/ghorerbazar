import { useState, useEffect } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { fetchCategories, fetchBrands } from '../../lib/products';
import { fetchSettings, saveSettings } from '../../lib/settings';
import ImageUpload from '../../components/ui/ImageUpload';

const FLAG_OPTIONS = ['Best Selling', 'New Arrival', 'Offered Items'];

const DEFAULT_HERO = [
  {
    id: 1,
    label: 'Slide 1',
    url: 'https://backoffice.ghorerbazar.com/banner/o1uH11775363016-light.jpg',
    link: '/shop',
    cta: 'Shop Now',
  },
  {
    id: 2,
    label: 'Slide 2',
    url: 'https://backoffice.ghorerbazar.com/banner/sCUkg1774768074-dark.png',
    link: '/collections/dates',
    cta: 'Explore Dates',
  },
  {
    id: 3,
    label: 'Slide 3',
    url: 'https://backoffice.ghorerbazar.com/banner/wvLKI1771837751.jpeg',
    link: '/collections/honey',
    cta: 'Shop Honey',
  },
];

function parseLinkType(link) {
  if (!link) return { type: 'custom', value: '' };
  const catMatch = link.match(/^\/collections\/(.+)$/);
  if (catMatch) return { type: 'category', value: catMatch[1] };
  const brandMatch = link.match(/^\/brands\/(.+)$/);
  if (brandMatch) return { type: 'brand', value: brandMatch[1] };
  const flagMatch = link.match(/[?&]flag=([^&]+)/);
  if (flagMatch) return { type: 'flag', value: decodeURIComponent(flagMatch[1]) };
  return { type: 'custom', value: link };
}

function buildLink(type, value) {
  if (type === 'category') return value ? `/collections/${value}` : '/shop';
  if (type === 'brand')    return value ? `/brands/${value}` : '/shop';
  if (type === 'flag')     return value ? `/shop?flag=${encodeURIComponent(value)}` : '/shop';
  return value || '/shop';
}

function LinkPicker({ value, onChange, categories, brands }) {
  const parsed = parseLinkType(value);
  const [type, setType]   = useState(parsed.type);
  const [val, setVal]     = useState(parsed.value);

  const handleType = (t) => {
    setType(t);
    setVal('');
    onChange(buildLink(t, ''));
  };

  const handleVal = (v) => {
    setVal(v);
    onChange(buildLink(type, v));
  };

  const selectCls = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange';

  return (
    <div className="space-y-2">
      <div className="flex gap-1 flex-wrap">
        {['category', 'flag', 'brand', 'custom'].map(t => (
          <button key={t} type="button" onClick={() => handleType(t)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              type === t ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {t === 'category' ? 'Category' : t === 'flag' ? 'Flag' : t === 'brand' ? 'Brand' : 'Custom'}
          </button>
        ))}
      </div>

      {type === 'category' && (
        <select value={val} onChange={e => handleVal(e.target.value)} className={selectCls}>
          <option value="">Select category…</option>
          {categories.map(c => (
            <option key={c.id} value={c.slug || c.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}>
              {c.name}
            </option>
          ))}
        </select>
      )}

      {type === 'flag' && (
        <select value={val} onChange={e => handleVal(e.target.value)} className={selectCls}>
          <option value="">Select flag…</option>
          {FLAG_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      )}

      {type === 'brand' && (
        <select value={val} onChange={e => handleVal(e.target.value)} className={selectCls}>
          <option value="">Select brand…</option>
          {brands.map(b => (
            <option key={b.id} value={b.slug || b.name.toLowerCase().replace(/\s+/g, '-')}>
              {b.name}
            </option>
          ))}
        </select>
      )}

      {type === 'custom' && (
        <input value={val} onChange={e => handleVal(e.target.value)}
          placeholder="/shop or https://..."
          className={selectCls} />
      )}

      <p className="text-[11px] text-gray-400 font-mono">{value || '/shop'}</p>
    </div>
  );
}

function BannerCard({ banner, onChange, onSave, saved, categories, brands }) {
  const [form, setForm] = useState({ ...banner });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const dirty = JSON.stringify(form) !== JSON.stringify(banner);

  // Update local form when banner prop changes (after save)
  useEffect(() => {
    setForm({ ...banner });
  }, [banner]);

  const handleSave = () => {
    onChange(form);
    onSave(form); // Pass the updated form data, not just the ID
  };

  return (
    <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-4 p-4 border-b border-gray-100">
        <div className="h-16 w-24 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
          {form.url && (
            <img src={form.url} alt={form.label}
              className="h-full w-full object-cover"
              onError={e => { e.currentTarget.src = ''; e.currentTarget.style.display = 'none'; }} />
          )}
        </div>
        <p className="text-sm font-semibold text-gray-900 flex-1">{form.label}</p>
        {saved && (
          <span className="inline-flex items-center gap-1 text-xs text-green-600">
            <CheckIcon className="h-3.5 w-3.5" /> Saved
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        <ImageUpload
          value={form.url}
          onChange={url => set('url', url)}
          folder="banners"
          label="Banner Image"
          required={true}
        />

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Link</label>
          <LinkPicker
            value={form.link}
            onChange={v => set('link', v)}
            categories={categories}
            brands={brands}
          />
        </div>

        {form.cta !== undefined && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">CTA Text</label>
            <input value={form.cta ?? ''} onChange={e => set('cta', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange" />
          </div>
        )}

        {form.heading !== undefined && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">CTA Text</label>
            <input value={form.heading} onChange={e => set('heading', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange" />
          </div>
        )}

        <div className="flex justify-end">
          <button disabled={!dirty}
            onClick={handleSave}
            className="rounded-full bg-brand-orange px-4 py-1.5 text-xs font-semibold text-white hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

const SPOTLIGHT_DEFAULTS = {
  hero_spotlight_url: 'https://backoffice.ghorerbazar.com/banner/vCjm21777706156.png',
  hero_spotlight_link: '/products/african-organic-wild-honey-250g',
};

function SpotlightSection({ categories, brands }) {
  const [form, setForm]     = useState(SPOTLIGHT_DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => {
    fetchSettings()
      .then(data => {
        setForm(f => ({
          ...f,
          ...(data.hero_spotlight_url  ? { hero_spotlight_url:  data.hero_spotlight_url  } : {}),
          ...(data.hero_spotlight_link ? { hero_spotlight_link: data.hero_spotlight_link } : {}),
        }));
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await saveSettings([
        { key: 'hero_spotlight_url',  value: form.hero_spotlight_url },
        { key: 'hero_spotlight_link', value: form.hero_spotlight_link },
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-700">Hero Spotlight (right panel)</h2>
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-4 p-4 border-b border-gray-100">
          <div className="h-20 w-14 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
            {form.hero_spotlight_url && (
              <img src={form.hero_spotlight_url} alt="Spotlight preview"
                className="h-full w-full object-cover"
                onError={e => { e.currentTarget.style.display = 'none'; }} />
            )}
          </div>
          <p className="text-sm font-semibold text-gray-900 flex-1">Product Spotlight</p>
          {saved && (
            <span className="inline-flex items-center gap-1 text-xs text-green-600">
              <CheckIcon className="h-3.5 w-3.5" /> Saved
            </span>
          )}
        </div>

        <div className="p-4 space-y-3">
          <ImageUpload
            value={form.hero_spotlight_url}
            onChange={url => setForm(f => ({ ...f, hero_spotlight_url: url }))}
            folder="banners"
            label="Spotlight Image"
            required={true}
          />

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Link</label>
            <LinkPicker
              value={form.hero_spotlight_link}
              onChange={v => setForm(f => ({ ...f, hero_spotlight_link: v }))}
              categories={categories}
              brands={brands}
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-brand-orange px-4 py-1.5 text-xs font-semibold text-white hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AdminBanners() {
  const [heroSlides, setHeroSlides]   = useState(DEFAULT_HERO);
  const [savedIds, setSavedIds]       = useState({});
  const [categories, setCategories]   = useState([]);
  const [brands, setBrands]           = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
    fetchBrands().then(setBrands).catch(() => {});
    
    // Load saved banners from database
    fetchSettings().then(data => {
      const slides = [];
      for (let i = 1; i <= 3; i++) {
        const url = data[`hero_slide_${i}_url`];
        const link = data[`hero_slide_${i}_link`] || '/shop';
        const cta = data[`hero_slide_${i}_cta`] || 'Shop Now';
        
        slides.push({
          id: i,
          label: `Slide ${i}`,
          url: url || DEFAULT_HERO[i - 1]?.url || '',
          link: link,
          cta: cta,
        });
      }
      setHeroSlides(slides);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async (updatedBanner) => {
    try {
      // First update the state with the new data
      setHeroSlides(prev => prev.map(s => s.id === updatedBanner.id ? updatedBanner : s));
      
      // Then save to database
      await saveSettings([
        { key: `hero_slide_${updatedBanner.id}_url`, value: updatedBanner.url },
        { key: `hero_slide_${updatedBanner.id}_link`, value: updatedBanner.link },
        { key: `hero_slide_${updatedBanner.id}_cta`, value: updatedBanner.cta },
      ]);
      
      setSavedIds(prev => ({ ...prev, [updatedBanner.id]: true }));
      setTimeout(() => setSavedIds(prev => ({ ...prev, [updatedBanner.id]: false })), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save banner. Please try again.');
    }
  };

  const updateHero = (u) => {
    // Update state immediately for UI responsiveness
    setHeroSlides(prev => prev.map(s => s.id === u.id ? u : s));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-orange border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Banners</h1>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">Hero Slides (3 Slides)</h2>
        <p className="text-xs text-gray-500">Full width slider images for homepage</p>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {heroSlides.map(s => (
            <BannerCard key={s.id} banner={s} onChange={updateHero} onSave={handleSave}
              saved={savedIds[s.id]} categories={categories} brands={brands} />
          ))}
        </div>
      </section>
    </div>
  );
}
