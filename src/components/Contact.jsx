import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, Clock, Sparkles, MessageSquare } from 'lucide-react';
import { contentService } from '../services/contentService';
import { inquiryService } from '../services/inquiryService';
import { servicesService } from '../services/servicesService';

export default function Contact({ preselectedService, preselectedProject }) {
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    whatsapp: '',
    location: '',
    turnaroundTime: '',
    heading: '',
    description: '',
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    serviceRequired: preselectedService || '',
    projectBudget: 'Not Sure Yet',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    contentService.getContactContent().then(data => {
      if (isMounted && data) {
        setContactInfo(prev => ({ ...prev, ...data }));
        if (Array.isArray(data.budgetOptions) && data.budgetOptions.length > 0) {
          setBudgetOptions(data.budgetOptions);
          setFormData(prev => {
            if (!prev.projectBudget || !data.budgetOptions.includes(prev.projectBudget)) {
              return {
                ...prev,
                projectBudget: data.budgetOptions.includes('Not Sure Yet')
                  ? 'Not Sure Yet'
                  : data.budgetOptions[data.budgetOptions.length - 1] || data.budgetOptions[0]
              };
            }
            return prev;
          });
        }
      }
    }).catch(err => {
      console.warn('Using cached contact info', err);
    });
    return () => { isMounted = false; };
  }, []);

  // Update service if preselected from service cards
  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, serviceRequired: preselectedService }));
    }
  }, [preselectedService]);

  // Update message if preselected from project case study
  useEffect(() => {
    if (preselectedProject) {
      setFormData(prev => ({
        ...prev,
        message: `Hi Yovexa Team, I would like to discuss building a project similar in architecture to ${preselectedProject}. Here are our requirements: `
      }));
    }
  }, [preselectedProject]);

  const [serviceOptions, setServiceOptions] = useState([]);

  useEffect(() => {
    let isMounted = true;
    servicesService.getServices({ activeOnly: true })
      .then(services => {
        if (isMounted && Array.isArray(services) && services.length > 0) {
          const titles = services.map(s => s.title);
          setServiceOptions([...titles, "Other / Custom Requirement"]);
          setFormData(prev => {
            if (!prev.serviceRequired) {
              return { ...prev, serviceRequired: preselectedService || titles[0] };
            }
            return prev;
          });
        } else if (isMounted) {
          setServiceOptions(["Other / Custom Requirement"]);
          setFormData(prev => ({
            ...prev,
            serviceRequired: prev.serviceRequired || "Other / Custom Requirement"
          }));
        }
      })
      .catch(err => {
        console.error('Failed to load services in contact form:', err);
        if (isMounted) {
          setServiceOptions(["Other / Custom Requirement"]);
        }
      });
    return () => { isMounted = false; };
  }, [preselectedService]);

  const [budgetOptions, setBudgetOptions] = useState([
    "Under ₹25,000",
    "₹25,000 – ₹50,000",
    "₹50,000 – ₹1,00,000",
    "₹1,00,000+",
    "Not Sure Yet"
  ]);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = "Please enter your full name.";
    }
    if (!formData.email.trim()) {
      errs.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.message.trim()) {
      errs.message = "Please describe what you are looking to build or improve.";
    } else if (formData.message.trim().length < 15) {
      errs.message = "Please provide at least a brief description (15+ characters).";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      await inquiryService.submitInquiry(formData);
      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        serviceRequired: serviceOptions[0] || 'Other / Custom Requirement',
        projectBudget: budgetOptions.includes('Not Sure Yet') ? 'Not Sure Yet' : (budgetOptions[budgetOptions.length - 1] || budgetOptions[0] || 'Not Sure Yet'),
        message: '',
      });
    } catch (err) {
      console.error("Submission error:", err);
      setApiError(err.response?.data?.message || err.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-28 sm:py-32 bg-[#F8FAFC] text-[#0B1B3A] relative tech-grid-bg overflow-hidden border-t border-[#E2E8F0] scroll-mt-20">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#0EA5E9]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-sky-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>Start a Conversation</span>
          </div>
          {contactInfo.heading && (
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1B3A] tracking-tight font-display">
              {contactInfo.heading}
            </h2>
          )}
          {contactInfo.description && (
            <p className="mt-4 text-base sm:text-lg text-[#334155] font-normal leading-relaxed">
              {contactInfo.description}
            </p>
          )}
        </div>

        {/* 2-Column Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column: Direct Communication & Expectation Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-card">
              <h3 className="text-xl font-bold text-[#0B1B3A] font-display mb-5">
                What Happens Next?
              </h3>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#0284C7] text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs shadow-sm">
                    1
                  </div>
                  <div>
                    <strong className="text-[#0B1B3A] text-sm">Review & Feasibility Check:</strong>
                    <p className="text-[#475569] mt-0.5 text-xs leading-relaxed font-normal">We analyze your requirements and prepare technical architecture recommendations.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#0284C7] text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs shadow-sm">
                    2
                  </div>
                  <div>
                    <strong className="text-[#0B1B3A] text-sm">Direct Technical Discussion:</strong>
                    <p className="text-[#475569] mt-0.5 text-xs leading-relaxed font-normal">Speak with an engineer directly to clarify technical milestones and dependencies.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#0284C7] text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs shadow-sm">
                    3
                  </div>
                  <div>
                    <strong className="text-[#0B1B3A] text-sm">Scope & Milestone Proposal:</strong>
                    <p className="text-[#475569] mt-0.5 text-xs leading-relaxed font-normal">Transparent deliverable schedule with realistic estimates and milestone payments.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Contact Info Tile */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-card space-y-4">
              {contactInfo.email && (
                <div className="flex items-center gap-3.5 text-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] flex items-center justify-center text-[#0284C7] shrink-0 border border-[#BAE6FD]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#0284C7] uppercase font-bold tracking-wider">Official Inquiries</div>
                    <a href={`mailto:${contactInfo.email}`} className="text-[#0B1B3A] font-semibold hover:text-[#0284C7] transition-colors">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              )}

              {contactInfo.turnaroundTime && (
                <div className="flex items-center gap-3.5 text-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] flex items-center justify-center text-[#0284C7] shrink-0 border border-[#BAE6FD]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#0284C7] uppercase font-bold tracking-wider">Turnaround Time</div>
                    <div className="text-[#0B1B3A] font-semibold">{contactInfo.turnaroundTime}</div>
                  </div>
                </div>
              )}

              {contactInfo.location && (
                <div className="flex items-center gap-3.5 text-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] flex items-center justify-center text-[#0284C7] shrink-0 border border-[#BAE6FD]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#0284C7] uppercase font-bold tracking-wider">Location</div>
                    <div className="text-[#0B1B3A] font-semibold">{contactInfo.location}</div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: High Contrast Accessible White Form Card */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-9 rounded-2xl bg-white text-[#0B1B3A] border border-[#E2E8F0] shadow-card">

              {isSubmitted ? (
                <div className="py-12 px-4 text-center space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0B1B3A] font-display">Inquiry Received</h3>
                  <p className="text-[#334155] text-sm max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to <strong className="text-[#0B1B3A]">Yovexa Solutions</strong>. We have received your project details and our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0B1B3A] hover:bg-[#183B75] transition-colors shadow-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                  {/* Row 1: Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5" htmlFor="fullName">
                        Full Name <span className="text-[#0284C7]">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition-all font-medium ${errors.fullName ? 'border-rose-500' : 'border-[#CBD5E1]'
                          }`}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-semibold">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5" htmlFor="email">
                        Email Address <span className="text-[#0284C7]">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. rahul@company.com"
                        className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition-all font-medium ${errors.email ? 'border-rose-500' : 'border-[#CBD5E1]'
                          }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-semibold">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Phone & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5" htmlFor="phone">
                        Phone Number <span className="text-[#64748B] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5" htmlFor="company">
                        Company / Organization <span className="text-[#64748B] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Acme Enterprises"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Row 3: Service Required & Project Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5" htmlFor="serviceRequired">
                        Service Required
                      </label>
                      <select
                        id="serviceRequired"
                        name="serviceRequired"
                        value={formData.serviceRequired}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition-all font-medium"
                      >
                        {serviceOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-white text-[#0F172A]">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5" htmlFor="projectBudget">
                        Estimated Budget
                      </label>
                      <select
                        id="projectBudget"
                        name="projectBudget"
                        value={formData.projectBudget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#CBD5E1] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition-all font-medium"
                      >
                        {budgetOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-white text-[#0F172A]">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Message */}
                  <div>
                    <label className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5" htmlFor="message">
                      Project Details & Requirements <span className="text-[#0284C7]">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about the project, key features, target timeline, or existing systems you want to connect..."
                      className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition-all resize-none font-medium ${errors.message ? 'border-rose-500' : 'border-[#CBD5E1]'
                        }`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.message}
                      </p>
                    )}
                  </div>

                  {/* API Error Notification */}
                  {apiError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{apiError}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-bold text-white bg-[#0EA5E9] hover:bg-[#0284C7] transition-all duration-200 shadow-sm text-sm disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-white" />
                          <span>Send Inquiry</span>
                        </>
                      )}
                    </button>
                    <p className="mt-2.5 text-xs text-center text-[#64748B] font-medium">
                      Zero spam. We respect your confidentiality and never share project specs.
                    </p>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
