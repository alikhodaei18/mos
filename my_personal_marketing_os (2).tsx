import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Building2,
  Target,
  Megaphone,
  TrendingUp,
  Award,
  Users,
  CheckSquare,
  FileText,
  Activity,
  BarChart3,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  Download,
  Upload,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight,
  Printer,
  Sparkles,
  ArrowRightLeft,
  UserPlus,
  Briefcase,
  HelpCircle,
  FileSpreadsheet,
  X,
  PieChart as PieIcon
} from 'lucide-react';

// --- INITIAL DEFAULT SAMPLE DATA ---
const INITIAL_BUSINESS = {
  id: 'biz_default_1',
  name: 'شرکت فناوری نوآوران',
  industry: 'نرم‌افزار و B2B SaaS',
  businessModel: 'حق اشتراک ماهانه (Subscription)',
  startDate: new Date().toISOString().split('T')[0],
  teamMembers: ['علی رضایی (مدیر مارکتینگ)', 'سارا محمدی (محتوا)', 'رضا احمدی (دیجیتال مارکتینگ)', 'مریم کاظمی (طراح UX)']
};

const INITIAL_TASKS = [
  {
    id: 't1',
    businessId: 'biz_default_1',
    title: 'مصاحبه شناخت با مدیرعامل و بررسی اهداف کیفی سالانه',
    description: 'استخراج اولویت‌های اصلی سازمان و انتظار از تیم بازاریابی',
    pillar: 'استراتژی و بازار',
    phase: 1,
    assignee: 'علی رضایی (مدیر مارکتینگ)',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    priority: 'high',
    status: 'completed',
    result: 'جلسه برگزار شد و هدف اصلی افزایش ۳۰ درصدی MRR تعیین گردید.'
  },
  {
    id: 't2',
    businessId: 'biz_default_1',
    title: 'بررسی وضعیت فعلی Google Analytics و سرچ کنسول',
    description: 'استخراج آمار ورودی‌های ارگانیک و تحلیل کلمات کلیدی اصلی',
    pillar: 'جذب مشتری و کمپین',
    phase: 1,
    assignee: 'رضا احمدی (دیجیتال مارکتینگ)',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    priority: 'urgent',
    status: 'in_progress',
    result: ''
  },
  {
    id: 't3',
    businessId: 'biz_default_1',
    title: 'بازنگری و ترسیم قیف فروش فعلی و نقاط ریزش سرنخ‌ها',
    description: 'بررسی مسیر تبدیل لید به مشتری با همکاری تیم فروش',
    pillar: 'فروش، CRM و تجربه مشتری',
    phase: 2,
    assignee: 'علی رضایی (مدیر مارکتینگ)',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 86400000 * 12).toISOString().split('T')[0],
    priority: 'medium',
    status: 'pending',
    result: ''
  }
];

const INITIAL_KPIS = [
  {
    id: 'k1',
    businessId: 'biz_default_1',
    name: 'تعداد سرنخ‌های راه‌یافته (MQL)',
    formula: 'مجموع لیدهای تاییدشده از فرم‌ها و کمپین‌ها در ماه',
    baseline: 120,
    target: 300,
    actual: 210,
    period: 'ماهانه',
    unit: 'عدد',
    active: true
  },
  {
    id: 'k2',
    businessId: 'biz_default_1',
    name: 'هزینه جذب مشتری (CAC)',
    formula: 'کل هزینه‌های بازاریابی و فروش تقسیم بر تعداد مشتریان جدید',
    baseline: 4500000,
    target: 3000000,
    actual: 3400000,
    period: 'ماهانه',
    unit: 'تومان',
    active: true
  },
  {
    id: 'k3',
    businessId: 'biz_default_1',
    name: 'نرخ بازگشت سرمایه تبلیغات (ROAS)',
    formula: 'درآمد حاصل از کمپین‌ها / کل هزینه پرداختی تبلیغات',
    baseline: 2.1,
    target: 4.5,
    actual: 3.8,
    period: 'کمپین',
    unit: 'برابر',
    active: true
  },
  {
    id: 'k4',
    businessId: 'biz_default_1',
    name: 'درآمد تکرارشونده ماهانه (MRR)',
    formula: 'مجموع حق اشتراک‌های فعال ماهانه',
    baseline: 150000000,
    target: 250000000,
    actual: 195000000,
    period: 'ماهانه',
    unit: 'تومان',
    active: true
  }
];

const INITIAL_CAMPAIGNS = [
  {
    id: 'c1',
    businessId: 'biz_default_1',
    name: 'کمپین رونمایی نسخه جدید نرم‌افزار',
    objective: 'جذب لید B2B و ارتقای برند',
    targetAudience: 'مدیران IT و مدیران عامل شرکت‌های متوسط',
    channels: 'لینکدین، ایمیل مارکتینگ، گوگل ادز',
    budget: 45000000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 20).toISOString().split('T')[0],
    owner: 'رضا احمدی',
    kpi: '۵۰ دمو ثبت شده',
    result: 'در حال اجرا - ۲۰ دمو تا کنون رزرو شد.'
  }
];

const INITIAL_MEETINGS = [
  {
    id: 'm1',
    businessId: 'biz_default_1',
    title: 'جلسه تراز استراتژیک با مدیرعامل',
    date: new Date().toISOString().split('T')[0],
    time: '۱۰:۳۰',
    attendees: 'مدیرعامل، مدیر مارکتینگ، مدیر فروش',
    agenda: 'تثبیت بودجه فاز اول و انتظارات فصل جدید',
    notes: 'تأکید شد که تمرکز بر مشتریان سازمانی بزرگ باشد.',
    decisions: 'تخصیص budget ۵۰ میلیونی برای ۳۰ روز اول.',
    actionItems: [
      { text: 'آماده‌سازی سند RFP تبلیغات گوگل', assignee: 'رضا احمدی', converted: false }
    ]
  }
];

const INITIAL_KNOWLEDGE_NOTES = [
  {
    id: 'kn1',
    businessId: 'biz_default_1',
    category: 'اطلاعات سازمان',
    title: 'تاریخچه و ارزش‌های کلیدی برند',
    content: 'شرکت در سال ۱۳۹۸ تاسیس شده. تمرکز اصلی بر سرعت، پشتیبانی ۲۴ ساعته و امنیت داده‌ها است.',
    pillar: 'استراتژی و بازار'
  },
  {
    id: 'kn2',
    businessId: 'biz_default_1',
    category: 'رقبا',
    title: 'تحلیل رقیب اصلی (شرکت آلفا)',
    content: 'نقاط قوت آن‌ها قیمت پایین‌تر است اما در بخش پشتیبانی فنی و تجربه کاربری ضعیف هستند.',
    pillar: 'استراتژی و بازار'
  }
];

// --- HELPER FUNCTIONS ---
const getJalaliDateStr = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(date);
  } catch (e) {
    return dateStr;
  }
};

export default function App() {
  // --- LOCAL STORAGE STATE MANAGEMENT ---
  const [businesses, setBusinesses] = useState(() => {
    const saved = localStorage.getItem('pm_os_businesses');
    return saved ? JSON.parse(saved) : [INITIAL_BUSINESS];
  });

  const [activeBizId, setActiveBizId] = useState(() => {
    const saved = localStorage.getItem('pm_os_active_biz');
    return saved || 'biz_default_1';
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('pm_os_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [kpis, setKpis] = useState(() => {
    const saved = localStorage.getItem('pm_os_kpis');
    return saved ? JSON.parse(saved) : INITIAL_KPIS;
  });

  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem('pm_os_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [meetings, setMeetings] = useState(() => {
    const saved = localStorage.getItem('pm_os_meetings');
    return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
  });

  const [knowledgeNotes, setKnowledgeNotes] = useState(() => {
    const saved = localStorage.getItem('pm_os_knowledge');
    return saved ? JSON.parse(saved) : INITIAL_KNOWLEDGE_NOTES;
  });

  // Funnel state for CRM section
  const [funnelStages, setFunnelStages] = useState(() => {
    const saved = localStorage.getItem('pm_os_funnel');
    return saved ? JSON.parse(saved) : [
      { stage: 'بازدیدکنندگان وب‌سایت / ورودی', count: 5000, conv: '100%' },
      { stage: 'سرنخ‌های دریافت شده (Leads)', count: 450, conv: '9.0%' },
      { stage: 'سرنخ‌های واجد شرایط (MQL/SQL)', count: 180, conv: '40.0%' },
      { stage: 'فرصت‌های مذاکره / دمو', count: 65, conv: '36.1%' },
      { stage: 'مشتریان نهایی خریدار', count: 22, conv: '33.8%' }
    ];
  });

  // Strategy documentation state
  const [strategyDoc, setStrategyDoc] = useState(() => {
    const saved = localStorage.getItem('pm_os_strategy_doc');
    return saved ? JSON.parse(saved) : {
      swotS: 'تیم فنی قوی، محصول پایدار، رضایت مشتریان فعلی',
      swotW: 'شناخته‌نشده بودن برند، کمبود محتوای تخصصی، بودجه محدود',
      swotO: 'رشد بازار دیجیتال، تقاضای بالای شرکت‌ها برای اتوماسیون',
      swotT: 'ورود رقبای جدید با سرمایه سنگین، نوسانات اقتصادی',
      valueProp: 'نرم‌افزار جامع مدیریت با نصب سریع و پشتیبانی اختصاصی رایگان',
      targetPersona: 'مدیران ارشد اجرایی، مدیران مارکتینگ و فروش سازمان‌های متراژ متوسط'
    };
  });

  // Modals & UI Controls
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showBizModal, setShowBizModal] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Persist Data Changes
  useEffect(() => {
    localStorage.setItem('pm_os_businesses', JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem('pm_os_active_biz', activeBizId);
  }, [activeBizId]);

  useEffect(() => {
    localStorage.setItem('pm_os_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pm_os_kpis', JSON.stringify(kpis));
  }, [kpis]);

  useEffect(() => {
    localStorage.setItem('pm_os_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('pm_os_meetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('pm_os_knowledge', JSON.stringify(knowledgeNotes));
  }, [knowledgeNotes]);

  useEffect(() => {
    localStorage.setItem('pm_os_funnel', JSON.stringify(funnelStages));
  }, [funnelStages]);

  useEffect(() => {
    localStorage.setItem('pm_os_strategy_doc', JSON.stringify(strategyDoc));
  }, [strategyDoc]);

  // Current Active Business Object
  const currentBiz = useMemo(() => {
    return businesses.find(b => b.id === activeBizId) || businesses[0] || INITIAL_BUSINESS;
  }, [businesses, activeBizId]);

  // Filter Data by Active Business
  const bizTasks = useMemo(() => tasks.filter(t => t.businessId === activeBizId), [tasks, activeBizId]);
  const bizKpis = useMemo(() => kpis.filter(k => k.businessId === activeBizId), [kpis, activeBizId]);
  const bizCampaigns = useMemo(() => campaigns.filter(c => c.businessId === activeBizId), [campaigns, activeBizId]);
  const bizMeetings = useMemo(() => meetings.filter(m => m.businessId === activeBizId), [meetings, activeBizId]);
  const bizNotes = useMemo(() => knowledgeNotes.filter(n => n.businessId === activeBizId), [knowledgeNotes, activeBizId]);

  // 90-Day Plan Calculations
  const planStats = useMemo(() => {
    if (!currentBiz?.startDate) return { day: 1, phase: 1, daysLeft: 90, progress: 0 };
    const start = new Date(currentBiz.startDate);
    const today = new Date();
    const diffTime = today - start;
    const diffDays = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
    
    let phase = 1;
    if (diffDays > 30 && diffDays <= 60) phase = 2;
    if (diffDays > 60) phase = 3;

    const daysLeft = Math.max(0, 90 - diffDays);
    const progress = Math.min(100, Math.round((diffDays / 90) * 100));

    return { day: diffDays, phase, daysLeft, progress };
  }, [currentBiz]);

  // Task Handlers
  const handleSaveTask = (taskData) => {
    if (taskData.id) {
      setTasks(tasks.map(t => t.id === taskData.id ? taskData : t));
    } else {
      const newTask = {
        ...taskData,
        id: 't_' + Date.now(),
        businessId: activeBizId
      };
      setTasks([newTask, ...tasks]);
    }
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('آیا از حذف این وظیفه اطمینان دارید؟')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const handleToggleTaskStatus = (id) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'completed' ? 'in_progress' : 'completed';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  // Convert Meeting Action Item to Task
  const convertActionToTask = (meetingId, actionIndex, actionText, assignee) => {
    const newTask = {
      id: 't_' + Date.now(),
      businessId: activeBizId,
      title: actionText,
      description: `تولیدشده خودکار از جلسه (${meetingId})`,
      pillar: 'مدیریت تیم و عملکرد',
      phase: planStats.phase,
      assignee: assignee || 'تعیین نشده',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      priority: 'high',
      status: 'pending',
      result: ''
    };
    setTasks([newTask, ...tasks]);

    // Mark as converted
    setMeetings(meetings.map(m => {
      if (m.id === meetingId) {
        const updatedActions = [...m.actionItems];
        updatedActions[actionIndex].converted = true;
        return { ...m, actionItems: updatedActions };
      }
      return m;
    }));
  };

  // Business Handlers
  const handleCreateBusiness = (name, industry, model) => {
    const newBiz = {
      id: 'biz_' + Date.now(),
      name,
      industry,
      businessModel: model,
      startDate: new Date().toISOString().split('T')[0],
      teamMembers: ['مدیر مارکتینگ']
    };
    setBusinesses([...businesses, newBiz]);
    setActiveBizId(newBiz.id);
    setShowBizModal(false);
  };

  // Backup & Restore
  const handleExportJSON = () => {
    const fullBackup = {
      businesses,
      tasks,
      kpis,
      campaigns,
      meetings,
      knowledgeNotes,
      funnelStages,
      strategyDoc,
      exportDate: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Personal_Marketing_OS_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (event) => {
    const fileReader = new FileReader();
    if (event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed.businesses) setBusinesses(parsed.businesses);
          if (parsed.tasks) setTasks(parsed.tasks);
          if (parsed.kpis) setKpis(parsed.kpis);
          if (parsed.campaigns) setCampaigns(parsed.campaigns);
          if (parsed.meetings) setMeetings(parsed.meetings);
          if (parsed.knowledgeNotes) setKnowledgeNotes(parsed.knowledgeNotes);
          if (parsed.funnelStages) setFunnelStages(parsed.funnelStages);
          if (parsed.strategyDoc) setStrategyDoc(parsed.strategyDoc);
          alert('اطلاعات با موفقیت بازیابی شد.');
        } catch (err) {
          alert('خطا در خواندن فایل پشتیبان. لطفاً از معتبر بودن فایل JSON مطمئن شوید.');
        }
      };
    }
  };

  const handleExportTasksCSV = () => {
    let csv = '\uFEFF'; // UTF-8 BOM for Persian Excel support
    csv += 'شناسه,عنوان,محور,فاز,مسئول,مهلت,اولویت,وضعیت\n';
    bizTasks.forEach(t => {
      csv += `"${t.id}","${t.title}","${t.pillar}","${t.phase}","${t.assignee}","${t.dueDate}","${t.priority}","${t.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Tasks_${currentBiz.name}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearAllData = () => {
    if (window.confirm('آیا مطمئن هستید؟ تمام داده‌های برنامه‌ریزی شما پاک خواهد شد!')) {
      localStorage.clear();
      setBusinesses([INITIAL_BUSINESS]);
      setActiveBizId('biz_default_1');
      setTasks([]);
      setKpis([]);
      setCampaigns([]);
      setMeetings([]);
      setKnowledgeNotes([]);
      alert('اطلاعات سیستم با موفقیت پاک‌سازی شد.');
    }
  };

  // --- MENU ITEMS ---
  const menuItems = [
    { id: 'dashboard', label: 'داشبورد اصلی', icon: LayoutDashboard },
    { id: 'plan90', label: 'برنامه ۹۰ روزه', icon: Calendar },
    { id: 'business_analysis', label: 'شناخت و تحلیل کسب‌وکار', icon: Building2 },
    { id: 'pillar_strategy', label: 'استراتژی و بازار', icon: Target },
    { id: 'pillar_campaigns', label: 'جذب مشتری و کمپین', icon: Megaphone },
    { id: 'pillar_crm', label: 'فروش، CRM و تجربه مشتری', icon: TrendingUp },
    { id: 'pillar_brand', label: 'برند و بازاریابی محصول', icon: Award },
    { id: 'pillar_team', label: 'مدیریت تیم و عملکرد', icon: Users },
    { id: 'tasks', label: 'مدیریت وظایف', icon: CheckSquare },
    { id: 'meetings_notes', label: 'جلسات و یادداشت‌ها', icon: FileText },
    { id: 'kpis', label: 'شاخص‌های عملکرد (KPI)', icon: Activity },
    { id: 'reports', label: 'گزارش‌ها', icon: BarChart3 },
    { id: 'settings', label: 'تنظیمات و پشتیبان‌گیری', icon: Settings }
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-800 border-l border-slate-700 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-lg">
              OS
            </div>
            <div>
              <h1 className="font-bold text-sm text-slate-100">سیستم شخصی من</h1>
              <p className="text-xs text-emerald-400 font-medium">My Marketing OS</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs md:text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-900/30'
                    : 'text-slate-300 hover:bg-slate-700/60 hover:text-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-700 bg-slate-800/50 text-xs text-slate-400 text-center">
          نسخه پیشرفته عملیاتی v2.5
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* HEADER */}
        <header className="bg-slate-800 border-b border-slate-700 p-3 md:px-6 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-400">کسب‌وکار فعال:</span>
              <select
                value={activeBizId}
                onChange={(e) => setActiveBizId(e.target.value)}
                className="bg-transparent text-sm font-semibold text-emerald-400 focus:outline-none cursor-pointer"
              >
                {businesses.map((b) => (
                  <option key={b.id} value={b.id} className="bg-slate-800 text-slate-200">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowBizModal(true)}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              افزایش کسب‌وکار
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400 hidden sm:block">
              {getJalaliDateStr(new Date())}
            </div>

            <button
              onClick={() => {
                setEditingTask(null);
                setShowTaskModal(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>وظیفه جدید</span>
            </button>
          </div>
        </header>

        {/* CONTENT BODY */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-900/95">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentBiz={currentBiz}
              planStats={planStats}
              tasks={bizTasks}
              kpis={bizKpis}
              meetings={bizMeetings}
              onNavigate={setActiveTab}
              onToggleTask={handleToggleTaskStatus}
            />
          )}

          {activeTab === 'plan90' && (
            <Plan90View
              planStats={planStats}
              tasks={bizTasks}
              onAddTask={(phase) => {
                setEditingTask({ phase, pillar: 'استراتژی و بازار', priority: 'medium', status: 'pending' });
                setShowTaskModal(true);
              }}
              onToggleTask={handleToggleTaskStatus}
            />
          )}

          {activeTab === 'business_analysis' && (
            <BusinessAnalysisView
              currentBiz={currentBiz}
              notes={bizNotes}
              onAddNote={(category) => {
                const title = prompt('عنوان یادداشت شناخت:');
                const content = prompt('محتوای یادداشت:');
                if (title && content) {
                  setKnowledgeNotes([
                    ...knowledgeNotes,
                    {
                      id: 'kn_' + Date.now(),
                      businessId: activeBizId,
                      category,
                      title,
                      content,
                      pillar: 'استراتژی و بازار'
                    }
                  ]);
                }
              }}
            />
          )}

          {activeTab === 'pillar_strategy' && (
            <PillarStrategyView
              strategyDoc={strategyDoc}
              setStrategyDoc={setStrategyDoc}
              tasks={bizTasks.filter(t => t.pillar === 'استراتژی و بازار')}
            />
          )}

          {activeTab === 'pillar_campaigns' && (
            <PillarCampaignsView
              campaigns={bizCampaigns}
              onAddCampaign={(cData) => {
                setCampaigns([...campaigns, { ...cData, id: 'c_' + Date.now(), businessId: activeBizId }]);
              }}
              onDeleteCampaign={(id) => setCampaigns(campaigns.filter(c => c.id !== id))}
            />
          )}

          {activeTab === 'pillar_crm' && (
            <PillarCRMView
              funnelStages={funnelStages}
              setFunnelStages={setFunnelStages}
              tasks={bizTasks.filter(t => t.pillar === 'فروش، CRM و تجربه مشتری')}
            />
          )}

          {activeTab === 'pillar_brand' && (
            <PillarBrandView
              tasks={bizTasks.filter(t => t.pillar === 'برند و بازاریابی محصول')}
            />
          )}

          {activeTab === 'pillar_team' && (
            <PillarTeamView
              currentBiz={currentBiz}
              tasks={bizTasks.filter(t => t.pillar === 'مدیریت تیم و عملکرد')}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksManagerView
              tasks={bizTasks}
              onAddTask={() => {
                setEditingTask(null);
                setShowTaskModal(true);
              }}
              onEditTask={(task) => {
                setEditingTask(task);
                setShowTaskModal(true);
              }}
              onDeleteTask={handleDeleteTask}
              onToggleTask={handleToggleTaskStatus}
            />
          )}

          {activeTab === 'meetings_notes' && (
            <MeetingsAndNotesView
              meetings={bizMeetings}
              notes={bizNotes}
              onAddMeeting={(m) => setMeetings([...meetings, { ...m, id: 'm_' + Date.now(), businessId: activeBizId }])}
              onConvertAction={convertActionToTask}
              onDeleteMeeting={(id) => setMeetings(meetings.filter(m => m.id !== id))}
            />
          )}

          {activeTab === 'kpis' && (
            <KpiManagerView
              kpis={bizKpis}
              onAddKpi={(kData) => setKpis([...kpis, { ...kData, id: 'k_' + Date.now(), businessId: activeBizId, active: true }])}
              onToggleKpiActive={(id) => setKpis(kpis.map(k => k.id === id ? { ...k, active: !k.active } : k))}
              onDeleteKpi={(id) => setKpis(kpis.filter(k => k.id !== id))}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              currentBiz={currentBiz}
              planStats={planStats}
              tasks={bizTasks}
              kpis={bizKpis}
              campaigns={bizCampaigns}
              meetings={bizMeetings}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              businesses={businesses}
              currentBiz={currentBiz}
              onExportJSON={handleExportJSON}
              onImportJSON={handleImportJSON}
              onExportTasksCSV={handleExportTasksCSV}
              onClearAll={handleClearAllData}
            />
          )}
        </main>
      </div>

      {/* --- MODAL: TASK EDIT / CREATE --- */}
      {showTaskModal && (
        <TaskFormModal
          task={editingTask}
          teamMembers={currentBiz.teamMembers || []}
          onSave={handleSaveTask}
          onClose={() => setShowTaskModal(false)}
        />
      )}

      {/* --- MODAL: CREATE BUSINESS --- */}
      {showBizModal && (
        <BusinessFormModal
          onSave={handleCreateBusiness}
          onClose={() => setShowBizModal(false)}
        />
      )}
    </div>
  );
}

// ==========================================
// COMPONENT: DASHBOARD VIEW
// ==========================================
function DashboardView({ currentBiz, planStats, tasks, kpis, meetings, onNavigate, onToggleTask }) {
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;

  const urgentTasks = tasks.filter(t => t.status !== 'completed').slice(0, 5);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* TOP STATS BANNER */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-500/20">
              مدیریت مارکتینگ فعال
            </span>
            <span className="text-xs text-slate-400">{currentBiz.industry}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-1">{currentBiz.name}</h2>
          <p className="text-xs text-slate-400 mt-1">مدل کسب‌وکار: {currentBiz.businessModel}</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
          <div className="text-center px-3 border-l border-slate-700">
            <span className="text-xs text-slate-400 block">فاز فعلی</span>
            <span className="text-sm font-bold text-emerald-400">فاز {planStats.phase} از ۳</span>
          </div>
          <div className="text-center px-3 border-l border-slate-700">
            <span className="text-xs text-slate-400 block">روز سپری‌شده</span>
            <span className="text-sm font-bold text-white">روز {planStats.day}</span>
          </div>
          <div className="text-center px-3">
            <span className="text-xs text-slate-400 block">پیشرفت برنامه</span>
            <span className="text-sm font-bold text-emerald-400">{planStats.progress}%</span>
          </div>
        </div>
      </div>

      {/* SUMMARY GRID CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>وظایف انجام‌شده</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{completedCount}</div>
          <div className="text-xs text-slate-400 mt-1">از کل {tasks.length} وظیفه ثبت شده</div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>در حال انجام</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{inProgressCount}</div>
          <div className="text-xs text-amber-400/80 mt-1">نیازمند پیگیری مستقیم</div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>در انتظار / انجام‌نشده</span>
            <AlertCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{pendingCount}</div>
          <div className="text-xs text-slate-400 mt-1">برنامه‌ریزی‌شده برای فازها</div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>شاخص‌های کلیدی فعال</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{kpis.filter(k => k.active).length}</div>
          <div className="text-xs text-emerald-400 mt-1">ارزیابی عملکرد آنلاین</div>
        </div>
      </div>

      {/* TWO COLUMNS: NEXT ACTIONS & KPIS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NEXT ACTIONS */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm md:text-base">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              اقدامات بعدی من (اولویت بالا)
            </h3>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
            >
              مشاهده همه
            </button>
          </div>

          {urgentTasks.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs bg-slate-900/40 rounded-lg">
              هیچ اقدام فوری ثبت نشده است.
            </div>
          ) : (
            <div className="space-y-2.5">
              {urgentTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 p-3 rounded-lg flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        task.status === 'completed'
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-600 hover:border-emerald-500'
                      }`}
                    >
                      {task.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-xs md:text-sm font-medium text-slate-200 truncate ${task.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="text-emerald-400">{task.pillar}</span>
                        <span>•</span>
                        <span>مسئول: {task.assignee}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      task.priority === 'urgent' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      task.priority === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {task.priority === 'urgent' ? 'فوری' : task.priority === 'high' ? 'بالا' : 'متوسط'}
                    </span>
                    <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {getJalaliDateStr(task.dueDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TOP KPIS OVERVIEW */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm md:text-base">
              <Activity className="w-4 h-4 text-emerald-400" />
              وضعیت تحقق اهداف
            </h3>
            <button
              onClick={() => onNavigate('kpis')}
              className="text-xs text-emerald-400 hover:underline"
            >
              مدیریت KPIها
            </button>
          </div>

          <div className="space-y-4">
            {kpis.filter(k => k.active).slice(0, 4).map((kpi) => {
              const pct = Math.min(100, Math.round((kpi.actual / kpi.target) * 100));
              return (
                <div key={kpi.id} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-200">{kpi.name}</span>
                    <span className="text-emerald-400 font-bold">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>فعلی: {kpi.actual.toLocaleString()} {kpi.unit}</span>
                    <span>هدف: {kpi.target.toLocaleString()} {kpi.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT: PLAN 90 DAYS VIEW
// ==========================================
function Plan90View({ planStats, tasks, onAddTask, onToggleTask }) {
  const phases = [
    {
      num: 1,
      title: 'فاز اول: شناخت و عارضه‌یابی',
      days: 'روز ۱ تا ۳۰',
      desc: 'شناخت سازمان، محصولات، مشتریان، بازار، رقبا، تیم و وضعیت فعلی مارکتینگ.',
      outcomes: 'گزارش شناخت کسب‌وکار، تحلیل وضعیت فعلی، مشکلات اصلی و فرصت‌های رشد.'
    },
    {
      num: 2,
      title: 'فاز دوم: طراحی و شروع اجرا',
      days: 'روز ۳۱ تا ۶۰',
      desc: 'تبدیل اطلاعات مرحله اول به برنامه عملیاتی و اجرای کمپین‌های اولیه.',
      outcomes: 'سند استراتژی، برنامه اجرایی و شروع آزمایش‌های بازاریابی.'
    },
    {
      num: 3,
      title: 'فاز سوم: بهینه‌سازی و توسعه',
      days: 'روز ۶۱ تا ۹۰',
      desc: 'بررسی نتایج، اصلاح فعالیت‌ها و تثبیت فرآیندهای بازاریابی و فروش.',
      outcomes: 'گزارش عملکرد ۹۰ روزه، سیستم عملیاتی تثبیت‌شده و برنامه توسعه فصل بعد.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* HEADER INFO */}
      <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            نقشه راه ۹۰ روزه مدیریت مارکتینگ
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            برنامه‌ریزی دقیق ورود به سازمان در ۳ گام استراتژیک و مأموریت‌محور
          </p>
        </div>
        <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-700 text-xs flex items-center gap-3">
          <div>
            <span className="text-slate-400 block">فاز جاری</span>
            <span className="text-emerald-400 font-bold text-sm">فاز {planStats.phase}</span>
          </div>
          <div className="w-px h-6 bg-slate-700" />
          <div>
            <span className="text-slate-400 block">روزهای باقیمانده</span>
            <span className="text-white font-bold text-sm">{planStats.daysLeft} روز</span>
          </div>
        </div>
      </div>

      {/* STAGES */}
      <div className="space-y-6">
        {phases.map((p) => {
          const isCurrent = planStats.phase === p.num;
          const phaseTasks = tasks.filter(t => t.phase === p.num);

          return (
            <div
              key={p.num}
              className={`bg-slate-800 border rounded-xl p-5 shadow-sm transition-all ${
                isCurrent ? 'border-emerald-500/80 ring-1 ring-emerald-500/30' : 'border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-700 pb-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      isCurrent ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {p.days}
                    </span>
                    <h3 className="font-bold text-white text-base">{p.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{p.desc}</p>
                </div>

                <button
                  onClick={() => onAddTask(p.num)}
                  className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  افزایش مأموریت به فاز {p.num}
                </button>
              </div>

              {/* OUTCOMES BANNER */}
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 mb-4 text-xs">
                <span className="text-emerald-400 font-semibold">خروجی نهایی متوقع: </span>
                <span className="text-slate-300">{p.outcomes}</span>
              </div>

              {/* TASKS LIST IN THIS PHASE */}
              <div className="space-y-2">
                {phaseTasks.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-3">هنوز هیچ مأموریتی برای این فاز اضافه نشده است.</p>
                ) : (
                  phaseTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-slate-900/40 hover:bg-slate-900 border border-slate-700/50 p-3 rounded-lg flex items-center justify-between text-xs gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onToggleTask(task.id)}
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            task.status === 'completed' ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-600'
                          }`}
                        >
                          {task.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                        </button>
                        <span className={`font-medium ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
                          {task.pillar}
                        </span>
                        <span className="text-slate-400">{task.assignee}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT: BUSINESS ANALYSIS VIEW
// ==========================================
function BusinessAnalysisView({ currentBiz, notes, onAddNote }) {
  const categories = [
    'اطلاعات سازمان',
    'محصولات و خدمات',
    'مشتریان',
    'رقبا',
    'فروش',
    'تیم و منابع انسانی',
    'بازاریابی',
    'مشکلات و چالش‌ها',
    'فرصت‌های رشد',
    'ایده‌ها و پیشنهادها'
  ];

  const [activeCat, setActiveCat] = useState('اطلاعات سازمان');

  const filteredNotes = notes.filter(n => n.category === activeCat);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            شناخت و عارضه‌یابی کامل کسب‌وکار
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            دفترچه جامع ثبت تحلیل‌ها و مستندات مدیریتی سازمان
          </p>
        </div>
        <button
          onClick={() => onAddNote(activeCat)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2 rounded-lg flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          ثبت یادداشت در دسته فعلی
        </button>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeCat === cat
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* CONTENT LIST */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-slate-200 text-sm mb-4">یادداشت‌های گروه: {activeCat}</h3>
        {filteredNotes.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs bg-slate-900/40 rounded-lg">
            هنوز داده‌ای در این بخش ثبت نشده است. برای ثبت تحلیل جدید از دکمه بالا استفاده کنید.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotes.map((note) => (
              <div key={note.id} className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg space-y-2">
                <h4 className="font-bold text-emerald-400 text-sm">{note.title}</h4>
                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT: PILLAR 1 - STRATEGY
// ==========================================
function PillarStrategyView({ strategyDoc, setStrategyDoc, tasks }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(strategyDoc);

  const handleSave = () => {
    setStrategyDoc(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            محور اول: استراتژی و شناخت بازار
          </h2>
          <p className="text-xs text-slate-400 mt-1">تدوین ارزش پیشنهادی، پرسونای مخاطب و تحلیل SWOT</p>
        </div>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-lg flex items-center gap-1 font-medium"
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          <span>{isEditing ? 'ذخیره تغییرات' : 'ویرایش سند استراتژی'}</span>
        </button>
      </div>

      {/* SWOT & STRATEGY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* VALUE PROP & PERSONA */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-emerald-400 text-sm">ارزش پیشنهادی (Value Proposition)</h3>
          {isEditing ? (
            <textarea
              value={formData.valueProp}
              onChange={(e) => setFormData({ ...formData, valueProp: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 p-3 rounded-lg focus:outline-none"
              rows={3}
            />
          ) : (
            <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-700/50">
              {strategyDoc.valueProp || 'هنوز تعریفی ثبت نشده است.'}
            </p>
          )}

          <h3 className="font-bold text-emerald-400 text-sm pt-2">پرسونای مخاطب هدف</h3>
          {isEditing ? (
            <textarea
              value={formData.targetPersona}
              onChange={(e) => setFormData({ ...formData, targetPersona: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 p-3 rounded-lg focus:outline-none"
              rows={3}
            />
          ) : (
            <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-700/50">
              {strategyDoc.targetPersona || 'هنوز تعریفی ثبت نشده است.'}
            </p>
          )}
        </div>

        {/* SWOT MATRIX */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-slate-200 text-sm mb-2">ماتریس تحلیل SWOT</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-emerald-950/40 border border-emerald-800/40 p-3 rounded-lg">
              <span className="font-bold text-emerald-400 block mb-1">نقاط قوت (Strengths)</span>
              {isEditing ? (
                <textarea
                  value={formData.swotS}
                  onChange={(e) => setFormData({ ...formData, swotS: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded"
                  rows={2}
                />
              ) : (
                <p className="text-slate-300">{strategyDoc.swotS}</p>
              )}
            </div>

            <div className="bg-amber-950/40 border border-amber-800/40 p-3 rounded-lg">
              <span className="font-bold text-amber-400 block mb-1">نقاط ضعف (Weaknesses)</span>
              {isEditing ? (
                <textarea
                  value={formData.swotW}
                  onChange={(e) => setFormData({ ...formData, swotW: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded"
                  rows={2}
                />
              ) : (
                <p className="text-slate-300">{strategyDoc.swotW}</p>
              )}
            </div>

            <div className="bg-blue-950/40 border border-blue-800/40 p-3 rounded-lg">
              <span className="font-bold text-blue-400 block mb-1">فرصت‌ها (Opportunities)</span>
              {isEditing ? (
                <textarea
                  value={formData.swotO}
                  onChange={(e) => setFormData({ ...formData, swotO: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded"
                  rows={2}
                />
              ) : (
                <p className="text-slate-300">{strategyDoc.swotO}</p>
              )}
            </div>

            <div className="bg-red-950/40 border border-red-800/40 p-3 rounded-lg">
              <span className="font-bold text-red-400 block mb-1">تهدیدها (Threats)</span>
              {isEditing ? (
                <textarea
                  value={formData.swotT}
                  onChange={(e) => setFormData({ ...formData, swotT: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded"
                  rows={2}
                />
              ) : (
                <p className="text-slate-300">{strategyDoc.swotT}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT: PILLAR 2 - CAMPAIGNS
// ==========================================
function PillarCampaignsView({ campaigns, onAddCampaign, onDeleteCampaign }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [channels, setChannels] = useState('');
  const [kpi, setKpi] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    onAddCampaign({
      name,
      budget: Number(budget) || 0,
      channels,
      kpi,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      owner: 'تیم مارکتینگ',
      result: 'شروع کمپین'
    });
    setName('');
    setBudget('');
    setChannels('');
    setKpi('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-emerald-400" />
            محور دوم: جذب مشتری و کمپین‌ها
          </h2>
          <p className="text-xs text-slate-400 mt-1">مدیریت کمپین‌های دیجیتال، بودجه‌بندی و کانال‌های جذب</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2 rounded-lg flex items-center gap-1 font-medium"
        >
          <Plus className="w-4 h-4" />
          تعریف کمپین جدید
        </button>
      </div>

      {/* CAMPAIGN CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.length === 0 ? (
          <div className="col-span-2 text-center py-10 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-400">
            هنوز هیچ کمپینی تعریف نشده است.
          </div>
        ) : (
          campaigns.map((c) => (
            <div key={c.id} className="bg-slate-800 border border-slate-700 p-5 rounded-xl space-y-3 relative">
              <button
                onClick={() => onDeleteCampaign(c.id)}
                className="absolute top-4 left-4 text-slate-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <h3 className="font-bold text-white text-base">{c.name}</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400 block">بودجه:</span>
                  <span className="font-semibold text-emerald-400">{Number(c.budget).toLocaleString()} تومان</span>
                </div>
                <div>
                  <span className="text-slate-400 block">کانال‌ها:</span>
                  <span>{c.channels}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">KPI اصلی:</span>
                  <span>{c.kpi}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">وضعیت/نتیجه:</span>
                  <span>{c.result}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 p-6 rounded-xl w-full max-w-md space-y-4">
            <h3 className="font-bold text-white text-base">ثبت کمپین جدید</h3>
            <div>
              <label className="text-xs text-slate-300 block mb-1">نام کمپین</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">بودجه (تومان)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">کانال‌های اجرا</label>
              <input
                value={channels}
                onChange={(e) => setChannels(e.target.value)}
                placeholder="مثلاً: گوگل، اینستاگرام، لینکدین"
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">هدف / KPI</label>
              <input
                value={kpi}
                onChange={(e) => setKpi(e.target.value)}
                placeholder="مثلاً: ۱۰۰ لید واجد شرایط"
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
              >
                ثبت کمپین
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ==========================================
// COMPONENT: PILLAR 3 - CRM & FUNNEL
// ==========================================
function PillarCRMView({ funnelStages, setFunnelStages }) {
  const handleUpdateCount = (index, val) => {
    const updated = [...funnelStages];
    updated[index].count = Number(val) || 0;
    
    // Recalculate basic conversion rates relative to stage 0
    const topCount = updated[0].count || 1;
    updated.forEach((stg, i) => {
      if (i === 0) stg.conv = '100%';
      else {
        const rate = ((stg.count / updated[i - 1].count) * 100).toFixed(1);
        stg.conv = `${isNaN(rate) ? 0 : rate}%`;
      }
    });

    setFunnelStages(updated);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          محور سوم: فروش، CRM و قیف تبدیل
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          مدیریت مراحل قیف فروش، بررسی نرخ تبدیل هر مرحله و ریزش سرنخ‌ها
        </p>
      </div>

      {/* FUNNEL VISUALIZER */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-slate-200 text-sm">قیف فروش و تبدیل (Sales Funnel)</h3>
        
        <div className="space-y-3 max-w-2xl mx-auto">
          {funnelStages.map((stg, idx) => {
            const widthPct = Math.max(25, 100 - idx * 15);
            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-3 rounded-xl border border-emerald-500/40 text-center text-white shadow-md transition-all"
                  style={{ width: `${widthPct}%` }}
                >
                  <div className="font-bold text-xs md:text-sm">{stg.stage}</div>
                  <div className="flex justify-between items-center px-4 mt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-emerald-200">تعداد:</span>
                      <input
                        type="number"
                        value={stg.count}
                        onChange={(e) => handleUpdateCount(idx, e.target.value)}
                        className="w-20 bg-slate-900/80 text-center rounded border border-emerald-400/30 text-white font-bold py-0.5 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-emerald-200">نرخ مرحله: </span>
                      <span className="font-bold text-amber-300">{stg.conv}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT: PILLAR 4 - BRAND & PRODUCT
// ==========================================
function PillarBrandView({ tasks }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400" />
          محور چهارم: برند و بازاریابی محصول (Product Marketing)
        </h2>
        <p className="text-xs text-slate-400 mt-1">تثبیت هویت برند، توسعه صفحات فرود و استراتژی معرفی محصول جدید</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl space-y-3">
          <h3 className="font-bold text-emerald-400 text-sm">هویت و جایگاه برند</h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-700">
            برند ما به عنوان یک راهکار قابل اعتماد، سریع و نوآورانه در بازار شناخته می‌شود. پیام اصلی ما سادگی در تعامل و پاسخگویی بالا است.
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl space-y-3">
          <h3 className="font-bold text-emerald-400 text-sm">مستندات و صفحات فروش کلیدی</h3>
          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li>صفحه اصلی معرفی محصول (Landing Page اصلی)</li>
            <li>کاتالوگ دیجیتال و نمونه‌کارهای موفق (Case Studies)</li>
            <li>ویدیوهای آموزشی و دمو محصول</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT: PILLAR 5 - TEAM & PERFORMANCE
// ==========================================
function PillarTeamView({ currentBiz, tasks }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-400" />
          محور پنجم: مدیریت تیم و عملکرد
        </h2>
        <p className="text-xs text-slate-400 mt-1">ساختار اعضای تیم، تقسیم مسئولیت‌ها و مدیریت پیمانکاران</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
        <h3 className="font-bold text-slate-200 text-sm">اعضا و مسئولیت‌های تیم بازاریابی</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {(currentBiz.teamMembers || []).map((member, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-700/60 p-3 rounded-lg flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                {idx + 1}
              </div>
              <span className="text-xs font-semibold text-slate-200">{member}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT: TASKS MANAGER (LIST & KANBAN)
// ==========================================
function TasksManagerView({ tasks, onAddTask, onEditTask, onDeleteTask, onToggleTask }) {
  const [viewMode, setViewMode] = useState('kanban'); // 'list' | 'kanban'
  const [filterPillar, setFilterPillar] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredTasks = tasks.filter(t => {
    if (filterPillar !== 'all' && t.pillar !== filterPillar) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  const columns = [
    { id: 'pending', title: 'در انتظار انجام', color: 'border-slate-600' },
    { id: 'in_progress', title: 'در حال انجام', color: 'border-amber-500' },
    { id: 'completed', title: 'تکمیل شده', color: 'border-emerald-500' }
  ];

  return (
    <div className="space-y-6">
      {/* CONTROLS */}
      <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${viewMode === 'kanban' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-300'}`}
          >
            کانبان (Board)
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-300'}`}
          >
            فهرست (List)
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex items-center gap-2 text-xs">
          <select
            value={filterPillar}
            onChange={(e) => setFilterPillar(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-300 p-1.5 rounded-lg"
          >
            <option value="all">همه محورها</option>
            <option value="استراتژی و بازار">استراتژی و بازار</option>
            <option value="جذب مشتری و کمپین">جذب مشتری و کمپین</option>
            <option value="فروش، CRM و تجربه مشتری">فروش و CRM</option>
            <option value="برند و بازاریابی محصول">برند و محصول</option>
            <option value="مدیریت تیم و عملکرد">مدیریت تیم</option>
          </select>

          <button
            onClick={onAddTask}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium"
          >
            <Plus className="w-4 h-4" />
            افزودن کارهای جدید
          </button>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col min-h-[400px]">
                <div className={`border-b-2 ${col.color} pb-2 mb-3 flex justify-between items-center`}>
                  <h3 className="font-bold text-white text-sm">{col.title}</h3>
                  <span className="text-xs bg-slate-900 px-2 py-0.5 rounded text-slate-400">{colTasks.length}</span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.map(t => (
                    <div key={t.id} className="bg-slate-900 border border-slate-700/80 p-3.5 rounded-lg space-y-2 shadow-sm relative group">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
                          {t.pillar}
                        </span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => onEditTask(t)} className="text-slate-400 hover:text-emerald-400">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => onDeleteTask(t.id)} className="text-slate-400 hover:text-red-400">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-100">{t.title}</h4>
                      {t.description && <p className="text-[11px] text-slate-400 line-clamp-2">{t.description}</p>}

                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                        <span>{t.assignee}</span>
                        <span>{getJalaliDateStr(t.dueDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="p-3">عنوان وظیفه</th>
                  <th className="p-3">محور</th>
                  <th className="p-3">مسئول</th>
                  <th className="p-3">مهلت</th>
                  <th className="p-3">اولویت</th>
                  <th className="p-3">وضعیت</th>
                  <th className="p-3">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-slate-300">
                {filteredTasks.map(t => (
                  <tr key={t.id} className="hover:bg-slate-700/30">
                    <td className="p-3 font-medium text-white">{t.title}</td>
                    <td className="p-3 text-emerald-400">{t.pillar}</td>
                    <td className="p-3">{t.assignee}</td>
                    <td className="p-3">{getJalaliDateStr(t.dueDate)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        t.priority === 'urgent' ? 'bg-red-500/20 text-red-400' : 'bg-slate-700'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => onToggleTask(t.id)}
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          t.status === 'completed' ? 'bg-emerald-600 text-white' : 'bg-amber-600/30 text-amber-300'
                        }`}
                      >
                        {t.status === 'completed' ? 'تکمیل‌شده' : 'در حال انجام'}
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onEditTask(t)} className="text-slate-400 hover:text-emerald-400">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDeleteTask(t.id)} className="text-slate-400 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// COMPONENT: MEETINGS & KNOWLEDGE NOTES
// ==========================================
function MeetingsAndNotesView({ meetings, notes, onAddMeeting, onConvertAction, onDeleteMeeting }) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [attendees, setAttendees] = useState('');
  const [notesText, setNotesText] = useState('');
  const [decisions, setDecisions] = useState('');
  const [actionText, setActionText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    onAddMeeting({
      title,
      date: new Date().toISOString().split('T')[0],
      time: '۱۲:۰۰',
      attendees,
      notes: notesText,
      decisions,
      actionItems: actionText ? [{ text: actionText, assignee: 'مسئول مربوطه', converted: false }] : []
    });
    setTitle('');
    setAttendees('');
    setNotesText('');
    setDecisions('');
    setActionText('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            جلسات مدیریتی و مصوبات
          </h2>
          <p className="text-xs text-slate-400 mt-1">ثبت جلسات و قابلیت تبدیل مستقیم مصوبه به وظیفه عملیاتی</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2 rounded-lg flex items-center gap-1 font-medium"
        >
          <Plus className="w-4 h-4" />
          ثبت صورت‌جلسه جدید
        </button>
      </div>

      <div className="space-y-4">
        {meetings.length === 0 ? (
          <div className="text-center py-10 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-400">
            هیچ صورت‌جلسه‌ای ثبت نشده است.
          </div>
        ) : (
          meetings.map((m) => (
            <div key={m.id} className="bg-slate-800 border border-slate-700 p-5 rounded-xl space-y-3 relative">
              <button
                onClick={() => onDeleteMeeting(m.id)}
                className="absolute top-4 left-4 text-slate-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs bg-emerald-600/20 text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/30">
                  {getJalaliDateStr(m.date)}
                </span>
                <h3 className="font-bold text-white text-base">{m.title}</h3>
              </div>

              <p className="text-xs text-slate-400">حاضرین: {m.attendees}</p>

              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 space-y-1 text-xs">
                <span className="font-bold text-slate-300 block">تصمیمات و مصوبات:</span>
                <p className="text-slate-200">{m.decisions}</p>
              </div>

              {/* ACTION ITEMS WITH CONVERT BUTTON */}
              {m.actionItems && m.actionItems.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-emerald-400 block">اقدامات بعدی استخراج‌شده:</span>
                  {m.actionItems.map((act, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-900 p-2 rounded text-xs border border-slate-700">
                      <span className="text-slate-200">{act.text} ({act.assignee})</span>
                      {act.converted ? (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> تبدیل‌شده به وظیفه
                        </span>
                      ) : (
                        <button
                          onClick={() => onConvertAction(m.id, idx, act.text, act.assignee)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] px-2 py-1 rounded"
                        >
                          + تبدیل به وظیفه
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ADD MEETING MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 p-6 rounded-xl w-full max-w-lg space-y-4">
            <h3 className="font-bold text-white text-base">ثبت صورت‌جلسه جدید</h3>
            <div>
              <label className="text-xs text-slate-300 block mb-1">عنوان جلسه</label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">افراد حاضر</label>
              <input
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">خلاصه مصوبات و تصمیمات</label>
              <textarea
                value={decisions}
                onChange={(e) => setDecisions(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
                rows={3}
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">اقدام عملیاتی قابل پیگیری</label>
              <input
                value={actionText}
                onChange={(e) => setActionText(e.target.value)}
                placeholder="کاری که باید انجام شود..."
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
              >
                ذخیره جلسه
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ==========================================
// COMPONENT: KPI MANAGER VIEW
// ==========================================
function KpiManagerView({ kpis, onAddKpi, onToggleKpiActive, onDeleteKpi }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [formula, setFormula] = useState('');
  const [baseline, setBaseline] = useState('');
  const [target, setTarget] = useState('');
  const [actual, setActual] = useState('');
  const [unit, setUnit] = useState('تومان');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    onAddKpi({
      name,
      formula,
      baseline: Number(baseline) || 0,
      target: Number(target) || 1,
      actual: Number(actual) || 0,
      unit,
      period: 'ماهانه'
    });
    setName('');
    setFormula('');
    setBaseline('');
    setTarget('');
    setActual('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            شاخص‌های عملکرد کلیدی (KPIs)
          </h2>
          <p className="text-xs text-slate-400 mt-1">تعریف، اندازه‌گیری و سنجش پایش اهداف مارکتینگ</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2 rounded-lg flex items-center gap-1 font-medium"
        >
          <Plus className="w-4 h-4" />
          تعریف شاخص جدید
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kpis.map((kpi) => {
          const pct = Math.min(100, Math.round((kpi.actual / kpi.target) * 100));
          return (
            <div
              key={kpi.id}
              className={`bg-slate-800 border rounded-xl p-5 space-y-3 relative ${
                kpi.active ? 'border-slate-700' : 'border-slate-800 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white text-sm">{kpi.name}</h3>
                  <p className="text-[11px] text-slate-400">{kpi.formula}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleKpiActive(kpi.id)}
                    className={`text-[10px] px-2 py-0.5 rounded ${
                      kpi.active ? 'bg-emerald-600/30 text-emerald-400' : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {kpi.active ? 'فعال' : 'غیرفعال'}
                  </button>
                  <button onClick={() => onDeleteKpi(kpi.id)} className="text-slate-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">درصد تحقق هدف:</span>
                  <span className="font-bold text-emerald-400">{pct}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-700/60">
                <div className="bg-slate-900/60 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block">پایه</span>
                  <span className="font-semibold text-slate-300">{kpi.baseline.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block">هدف</span>
                  <span className="font-semibold text-amber-400">{kpi.target.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block">واقعی</span>
                  <span className="font-semibold text-emerald-400">{kpi.actual.toLocaleString()} {kpi.unit}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 p-6 rounded-xl w-full max-w-md space-y-4">
            <h3 className="font-bold text-white text-base">تعریف شاخص جدید (KPI)</h3>
            <div>
              <label className="text-xs text-slate-300 block mb-1">نام شاخص</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">فرمول یا نحوه محاسبه</label>
              <input
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-slate-300 block mb-1">پایه</label>
                <input
                  type="number"
                  value={baseline}
                  onChange={(e) => setBaseline(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2 rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">هدف</label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2 rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">واقعی</label>
                <input
                  type="number"
                  value={actual}
                  onChange={(e) => setActual(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
              >
                ثبت شاخص
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ==========================================
// COMPONENT: REPORTS VIEW (PRINTABLE)
// ==========================================
function ReportsView({ currentBiz, planStats, tasks, kpis, campaigns, meetings }) {
  const [reportType, setReportType] = useState('90day'); // 'weekly' | 'monthly' | '90day'

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            گزارش‌های مدیریتی جامع
          </h2>
          <p className="text-xs text-slate-400 mt-1">تولید خودکار گزارش‌های قابل ارائه به مدیرعامل و هیئت مدیره</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-white p-2 rounded-lg"
          >
            <option value="weekly">گزارش هفتگی</option>
            <option value="monthly">گزارش ماهانه</option>
            <option value="90day">گزارش نهایی ۹۰ روزه</option>
          </select>

          <button
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2 rounded-lg flex items-center gap-1 font-medium"
          >
            <Printer className="w-4 h-4" />
            پرینت / دانلود PDF
          </button>
        </div>
      </div>

      {/* REPORT CONTENT AREA */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 space-y-6 print:bg-white print:text-black print:border-none">
        <div className="border-b border-slate-700 print:border-gray-300 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white print:text-black">
              گزارش مدیریتی مارکتینگ - {currentBiz.name}
            </h1>
            <p className="text-xs text-slate-400 print:text-gray-600 mt-1">
              نوع گزارش: {reportType === 'weekly' ? 'هفتگی' : reportType === 'monthly' ? 'ماهانه' : 'جمع‌بندی ۹۰ روزه'}
            </p>
          </div>
          <div className="text-left text-xs text-slate-400 print:text-gray-600">
            <div>تاریخ تنظیم: {getJalaliDateStr(new Date())}</div>
            <div>وضعیت برنامه: روز {planStats.day} (فاز {planStats.phase})</div>
          </div>
        </div>

        {/* SECTION 1: EXECUTIVE SUMMARY */}
        <div className="space-y-2">
          <h3 className="font-bold text-emerald-400 print:text-emerald-800 text-sm">۱. خلاصه اجرایی و وضعیت پیشرفت</h3>
          <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed">
            تیم بازاریابی تا کنون موفق به تکمیل {tasks.filter(t => t.status === 'completed').length} مأموریت اجرایی شده است. 
            پیشرفت کل برنامه ۹۰ روزه برابر با {planStats.progress} درصد ارزیابی می‌شود.
          </p>
        </div>

        {/* SECTION 2: KPIS */}
        <div className="space-y-3">
          <h3 className="font-bold text-emerald-400 print:text-emerald-800 text-sm">۲. وضعیت شاخص‌های عملکرد (KPI)</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {kpis.filter(k => k.active).map(k => (
              <div key={k.id} className="bg-slate-900/60 print:bg-gray-100 p-3 rounded border border-slate-700 print:border-gray-300">
                <div className="font-bold text-white print:text-black">{k.name}</div>
                <div className="text-slate-400 print:text-gray-600 mt-1">
                  واقعی: {k.actual.toLocaleString()} / هدف: {k.target.toLocaleString()} {k.unit}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: COMPLETED TASKS */}
        <div className="space-y-2">
          <h3 className="font-bold text-emerald-400 print:text-emerald-800 text-sm">۳. مهم‌ترین کارهای انجام‌شده</h3>
          <ul className="text-xs space-y-1 text-slate-300 print:text-gray-800 list-disc list-inside">
            {tasks.filter(t => t.status === 'completed').map(t => (
              <li key={t.id}>{t.title} ({t.pillar})</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT: SETTINGS & BACKUP
// ==========================================
function SettingsView({ businesses, currentBiz, onExportJSON, onImportJSON, onExportTasksCSV, onClearAll }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          تنظیمات و پشتیبان‌گیری داده‌ها
        </h2>
        <p className="text-xs text-slate-400 mt-1">مدیریت فایل پشتیبان JSON، خروجی‌های CSV و پاک‌سازی داده‌ها</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BACKUP & RESTORE */}
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl space-y-4">
          <h3 className="font-bold text-emerald-400 text-sm">پشتیبان‌گیری کامل (JSON)</h3>
          <p className="text-xs text-slate-300">
            شما می‌توانید تمام اطلاعات کسب‌وکارها، وظایف، KPIها و جلسات را در قالب یک فایل ذخیره کرده یا بازیابی کنید.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onExportJSON}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2 rounded-lg flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              دانلود پشتیبان JSON
            </button>

            <label className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer">
              <Upload className="w-4 h-4" />
              بارگذاری JSON
              <input type="file" accept=".json" onChange={onImportJSON} className="hidden" />
            </label>
          </div>
        </div>

        {/* CSV EXPORTS */}
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl space-y-4">
          <h3 className="font-bold text-emerald-400 text-sm">خروجی اکسل / CSV</h3>
          <p className="text-xs text-slate-300">استخراج لیست وظایف کسب‌وکار فعلی جهت استفاده در Excel</p>
          <button
            onClick={onExportTasksCSV}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs px-3 py-2 rounded-lg flex items-center gap-1"
          >
            <FileSpreadsheet className="w-4 h-4" />
            دانلود خروجی CSV وظایف
          </button>
        </div>

        {/* DANGER ZONE */}
        <div className="bg-slate-800 border border-red-900/40 p-5 rounded-xl space-y-3 col-span-1 md:col-span-2">
          <h3 className="font-bold text-red-400 text-sm">منطقه خطر (پاک‌سازی داده‌ها)</h3>
          <p className="text-xs text-slate-400">حذف تمام داده‌های ذخیره‌شده در مرورگر و بازگشت به تنظیمات اولیه</p>
          <button
            onClick={onClearAll}
            className="bg-red-600/80 hover:bg-red-600 text-white text-xs px-3 py-2 rounded-lg flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            پاک‌سازی کل اطلاعات سیستم
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODAL: TASK FORM MODAL
// ==========================================
function TaskFormModal({ task, teamMembers, onSave, onClose }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [pillar, setPillar] = useState(task?.pillar || 'استراتژی و بازار');
  const [phase, setPhase] = useState(task?.phase || 1);
  const [assignee, setAssignee] = useState(task?.assignee || teamMembers[0] || 'تعیین نشده');
  const [dueDate, setDueDate] = useState(task?.dueDate || new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [status, setStatus] = useState(task?.status || 'pending');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    onSave({
      ...(task || {}),
      title,
      description,
      pillar,
      phase: Number(phase),
      assignee,
      dueDate,
      priority,
      status
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 p-6 rounded-xl w-full max-w-md space-y-4">
        <h3 className="font-bold text-white text-base">{task ? 'ویرایش وظیفه' : 'ثبت وظیفه جدید'}</h3>

        <div>
          <label className="text-xs text-slate-300 block mb-1">عنوان وظیفه</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
          />
        </div>

        <div>
          <label className="text-xs text-slate-300 block mb-1">محور بازاریابی مرتبط</label>
          <select
            value={pillar}
            onChange={(e) => setPillar(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
          >
            <option value="استراتژی و بازار">استراتژی و بازار</option>
            <option value="جذب مشتری و کمپین">جذب مشتری و کمپین</option>
            <option value="فروش، CRM و تجربه مشتری">فروش، CRM و تجربه مشتری</option>
            <option value="برند و بازاریابی محصول">برند و بازاریابی محصول</option>
            <option value="مدیریت تیم و عملکرد">مدیریت تیم و عملکرد</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-300 block mb-1">فاز برنامه ۹۰ روزه</label>
            <select
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
            >
              <option value={1}>فاز ۱ (روز ۱ تا ۳۰)</option>
              <option value={2}>فاز ۲ (روز ۳۱ تا ۶۰)</option>
              <option value={3}>فاز ۳ (روز ۶۱ تا ۹۰)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">اولویت</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
            >
              <option value="low">پایین</option>
              <option value="medium">متوسط</option>
              <option value="high">بالا</option>
              <option value="urgent">فوری</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-300 block mb-1">مسئول اجرا</label>
          <input
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
          />
        </div>

        <div>
          <label className="text-xs text-slate-300 block mb-1">تاریخ مهلت تحویل</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-xs">
            انصراف
          </button>
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold">
            ذخیره وظیفه
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// MODAL: CREATE BUSINESS MODAL
// ==========================================
function BusinessFormModal({ onSave, onClose }) {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [model, setModel] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    onSave(name, industry || 'نامشخص', model || 'تعیین نشده');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 p-6 rounded-xl w-full max-w-md space-y-4">
        <h3 className="font-bold text-white text-base">افزایش کسب‌وکار جدید</h3>
        <div>
          <label className="text-xs text-slate-300 block mb-1">نام سازمان / شرکت</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
          />
        </div>
        <div>
          <label className="text-xs text-slate-300 block mb-1">صنعت و حوزه فعالیت</label>
          <input
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="مثلاً: E-commerce, B2B SaaS"
            className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
          />
        </div>
        <div>
          <label className="text-xs text-slate-300 block mb-1">مدل درآمدی</label>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="مثلاً: فروش مستقیم، اشتراکی"
            className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-xs">
            انصراف
          </button>
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold">
            ایجاد پرونده کسب‌وکار
          </button>
        </div>
      </form>
    </div>
  );
}