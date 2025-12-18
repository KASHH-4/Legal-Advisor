const API_URL = window.location.origin;

// ==========================================
// SETTINGS MANAGEMENT
// ==========================================
const STORAGE_KEY = 'legaldocs_api_url';

// Initialize API URL from localStorage on page load
function initializeApiUrl() {
    const storedUrl = localStorage.getItem(STORAGE_KEY);
    if (storedUrl) {
        console.log('✅ API URL configured');
    } else {
        console.warn('⚠️ API URL not configured');
    }
}

// Toggle settings sidebar
function toggleSettings() {
    const sidebar = document.getElementById('settingsSidebar');
    const overlay = document.getElementById('settingsOverlay');
    const input = document.getElementById('apiUrlInput');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Load current URL when opening
    if (sidebar.classList.contains('active')) {
        const storedUrl = localStorage.getItem(STORAGE_KEY);
        input.value = storedUrl || '';
        
        // Update status display
        if (storedUrl) {
            updateApiStatus('success', 'Current API URL is configured');
        } else {
            updateApiStatus('warning', 'No API URL configured yet');
        }
    }
}

// Save API URL to localStorage
function saveApiUrl() {
    const input = document.getElementById('apiUrlInput');
    const url = input.value.trim();
    
    if (!url) {
        updateApiStatus('error', 'Please enter a valid URL');
        return;
    }
    
    // Basic URL validation
    try {
        const urlObj = new URL(url);
        if (!urlObj.protocol.match(/^https?:$/)) {
            updateApiStatus('error', 'URL must start with http:// or https://');
            return;
        }
    } catch (e) {
        updateApiStatus('error', 'Invalid URL format');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, url);
    updateApiStatus('success', 'API URL saved successfully!');
    
    // Close sidebar after a short delay
    setTimeout(() => {
        toggleSettings();
    }, 1500);
}

// Update API status message
function updateApiStatus(type, message) {
    const statusDiv = document.getElementById('apiUrlStatus');
    statusDiv.className = `api-status ${type}`;
    statusDiv.textContent = message;
}

// Get API URL for requests
function getApiUrl() {
    return localStorage.getItem(STORAGE_KEY);
}

// Check if API URL is configured
function isApiConfigured() {
    return !!localStorage.getItem(STORAGE_KEY);
}

const questions = [
    {
        id: 'startup_name',
        section: 'A. BASIC STARTUP INFORMATION',
        text: "What is your startup's name?",
        type: 'text',
        required: true
    },
    {
        id: 'industry',
        section: 'A. BASIC STARTUP INFORMATION',
        text: 'Which industry/domain does your startup operate in?',
        subtitle: 'e.g., fintech, AI/ML, SaaS, edtech, e-commerce, healthtech, manufacturing, HR-tech, gaming, etc.',
        type: 'text',
        required: true
    },
    {
        id: 'description',
        section: 'A. BASIC STARTUP INFORMATION',
        text: 'Describe your startup in one or two sentences',
        subtitle: 'This helps the model understand your exact business model',
        type: 'textarea',
        required: true
    },
    {
        id: 'company_structure',
        section: 'A. BASIC STARTUP INFORMATION',
        text: 'What is your current company structure?',
        type: 'buttons',
        options: [
            'Not registered yet',
            'Sole proprietorship',
            'Partnership',
            'LLP',
            'Private Limited Company',
            'Public Limited',
            'One Person Company',
            'Other'
        ],
        allowOther: true,
        required: true
    },
    {
        id: 'num_founders',
        section: 'B. FOUNDERS & OWNERSHIP',
        text: 'How many founders does your startup have?',
        type: 'number',
        required: true
    },
    {
        id: 'founder_agreement',
        section: 'B. FOUNDERS & OWNERSHIP',
        text: 'Do you have a founder agreement in place?',
        subtitle: 'A legal document that defines roles, equity split, and responsibilities among founders',
        type: 'buttons',
        options: ['Yes', 'No'],
        required: true
    },
    {
        id: 'ownership_splits',
        section: 'B. FOUNDERS & OWNERSHIP',
        text: 'Should the documents consider ownership splits or equity distribution?',
        subtitle: 'Defines who owns what percentage of the company and vesting schedules',
        type: 'buttons',
        options: ['Yes', 'No'],
        required: true
    },
    {
        id: 'has_employees',
        section: 'C. EMPLOYEES & TEAM STRUCTURE',
        text: 'Do you currently have employees?',
        type: 'buttons',
        options: ['Yes', 'No'],
        required: true
    },
    {
        id: 'num_employees',
        section: 'C. EMPLOYEES & TEAM STRUCTURE',
        text: 'How many employees or interns?',
        type: 'number',
        subtitle: 'Skip if you answered No to previous question',
        required: false,
        conditionalOn: { field: 'has_employees', value: 'Yes' }
    },
    {
        id: 'plan_to_hire',
        section: 'C. EMPLOYEES & TEAM STRUCTURE',
        text: 'Do you plan to hire soon?',
        type: 'buttons',
        options: ['Yes', 'No'],
        required: true
    },
    {
        id: 'product_type',
        section: 'D. PRODUCT / TECH / OPERATIONS',
        text: 'What type of product/service do you offer?',
        type: 'buttons',
        options: [
            'Software app / SaaS',
            'AI model/service',
            'Physical product / hardware',
            'Advisory/consulting',
            'Marketplace',
            'Platform (B2B/B2C)',
            'Other'
        ],
        allowOther: true,
        required: true
    },
    {
        id: 'collects_user_data',
        section: 'D. PRODUCT / TECH / OPERATIONS',
        text: 'Do you collect or process user data?',
        subtitle: 'A Privacy Policy is legally required if you collect any personal data (emails, names, etc.)',
        type: 'buttons',
        options: ['Yes', 'No'],
        required: true
    },
    {
        id: 'data_type',
        section: 'D. PRODUCT / TECH / OPERATIONS',
        text: 'What kind of data?',
        subtitle: 'Select all that apply',
        type: 'checkboxes',
        options: ['Personal', 'Financial', 'Medical', 'Behavioural', 'Other'],
        required: false,
        conditionalOn: { field: 'collects_user_data', value: 'Yes' }
    },
    {
        id: 'primary_customers',
        section: 'E. CUSTOMERS & MARKET',
        text: 'Who are your primary customers?',
        type: 'buttons',
        options: ['Individuals (B2C)', 'Businesses (B2B)', 'Government', 'Mixed'],
        required: true
    },
    {
        id: 'has_vendors',
        section: 'E. CUSTOMERS & MARKET',
        text: 'Do you work with vendors/partners?',
        subtitle: 'Vendor agreements protect both parties and define service delivery terms',
        type: 'buttons',
        options: ['Yes', 'No'],
        required: true
    },
    {
        id: 'client_contracts',
        section: 'E. CUSTOMERS & MARKET',
        text: 'Do you plan to onboard clients under contracts?',
        type: 'buttons',
        options: ['Yes', 'No'],
        required: true
    },
    {
        id: 'has_ip',
        section: 'F. INTELLECTUAL PROPERTY (IP)',
        text: 'Do you have any proprietary technology, designs, or brand assets?',
        subtitle: 'IP includes patents (inventions), trademarks (brand names/logos), and copyrights (creative works)',
        type: 'buttons',
        options: ['Yes', 'No'],
        required: true
    },
    {
        id: 'ip_types',
        section: 'F. INTELLECTUAL PROPERTY (IP)',
        text: 'What type of IP protection do you need?',
        subtitle: 'Select all that apply',
        type: 'checkboxes',
        options: ['Patents', 'Copyrights', 'Trademarks', 'Licensing agreements'],
        required: false,
        conditionalOn: { field: 'has_ip', value: 'Yes' }
    },
    {
        id: 'startup_stage',
        section: 'G. FINANCIALS & FUNDRAISING',
        text: 'What stage is your startup currently in?',
        type: 'buttons',
        options: ['Idea', 'Validation / MVP', 'Early revenue', 'Scaling'],
        required: true
    },
    {
        id: 'raising_funds',
        section: 'G. FINANCIALS & FUNDRAISING',
        text: 'Have you raised or are you planning to raise funds?',
        type: 'buttons',
        options: ['Yes', 'No'],
        required: true
    },
    {
        id: 'funding_type',
        section: 'G. FINANCIALS & FUNDRAISING',
        text: 'What type of funding?',
        type: 'buttons',
        options: ['Angel', 'Seed', 'VC', 'Grant', 'Crowdfunding', 'Multiple', 'Other'],
        allowOther: true,
        required: false,
        conditionalOn: { field: 'raising_funds', value: 'Yes' }
    },
    {
        id: 'considering_esops',
        section: 'G. FINANCIALS & FUNDRAISING',
        text: 'Are you considering ESOPs?',
        subtitle: 'Employee Stock Ownership Plans - a way to compensate employees with company equity',
        type: 'buttons',
        options: ['Yes', 'No'],
        required: true
    },
    {
        id: 'regulated_industry',
        section: 'H. RISK / COMPLIANCE NEEDS',
        text: 'Do you operate in a regulated industry?',
        subtitle: 'Select all that apply',
        type: 'checkboxes',
        options: ['Fintech', 'Health', 'Logistics', 'Finance/Banking', 'Food', 'Education', 'None'],
        required: true
    },
    {
        id: 'operates_internationally',
        section: 'H. RISK / COMPLIANCE NEEDS',
        text: 'Does your startup operate internationally?',
        type: 'buttons',
        options: ['Yes', 'No'],
        required: true
    },
    {
        id: 'countries',
        section: 'H. RISK / COMPLIANCE NEEDS',
        text: 'List the countries',
        subtitle: 'Separate countries with commas',
        type: 'text',
        required: false,
        conditionalOn: { field: 'operates_internationally', value: 'Yes' }
    },
    {
        id: 'turnover_exceeds_20l',
        section: 'I. GST QUESTIONS',
        text: 'Do you expect your annual turnover to exceed INR 20 lakh?',
        subtitle: 'GST registration becomes mandatory above this threshold',
        type: 'buttons',
        options: ['Yes', 'No', 'Unsure'],
        required: true
    },
    {
        id: 'sells_products_services',
        section: 'I. GST QUESTIONS',
        text: 'Do you sell physical products, digital services, or both?',
        subtitle: 'GST rates vary; product sellers must generate GST-compliant invoices',
        type: 'buttons',
        options: ['Physical products', 'Digital services', 'Both'],
        required: true
    },
    {
        id: 'sells_outside_india',
        section: 'I. GST QUESTIONS',
        text: 'Do you sell your product/services outside India?',
        subtitle: 'If yes → GST LUT, export documentation, zero-rated supply requirements',
        type: 'buttons',
        options: ['Yes', 'No'],
        required: true
    },
    {
        id: 'sells_through_platforms',
        section: 'I. GST QUESTIONS',
        text: 'Do you sell through online platforms/marketplaces?',
        subtitle: 'E-commerce operators have special GST compliance and TCS rules',
        type: 'buttons',
        options: ['Yes', 'No'],
        required: true
    },
    {
        id: 'buys_for_business',
        section: 'I. GST QUESTIONS',
        text: 'Do you buy goods/services for business (ITC eligibility)?',
        subtitle: 'To generate ITC-related compliance recommendations',
        type: 'buttons',
        options: ['Yes', 'No', 'Unsure'],
        required: true
    },
    {
        id: 'gst_registration_timing',
        section: 'I. GST QUESTIONS',
        text: 'Do you want GST registration done immediately?',
        subtitle: 'Helps include GSTIN and registration documents in the list',
        type: 'buttons',
        options: ['Yes', 'No', 'Later'],
        required: true
    }
];

// ==========================================
// STATE MANAGEMENT
// ==========================================
let currentQuestionIndex = 0;
let answers = {};
let generatedDocuments = null;

// Legal facts for loading screen
const legalFacts = [
    "Most early-stage startup disputes happen because the founders never created a written founder agreement.",
    "A Privacy Policy is legally required in India if your startup collects any personal data — even just email IDs.",
    "Every e-commerce business selling in India must display a return/refund policy, or they can be penalized under consumer protection laws.",
    "If your startup exports services, you can file a GST LUT to avoid paying IGST on exports.",
    "Most investors ask to see your company's cap table before reviewing your pitch deck.",
    "A Terms of Service agreement legally protects startups far more than a Privacy Policy does.",
    "Non-Disclosure Agreements (NDAs) are enforceable in India — even verbal agreements can sometimes be considered binding.",
    "Under Indian law, an NDA must include 'consideration' (something of value) to be enforceable.",
    "A startup can be private limited with just one director if they use a nominee director.",
    "Misclassifying an employee as an intern or contractor can lead to major penalties.",
    "India is one of the largest markets for SaaS startups, especially for B2B tools.",
    "Every company providing online services must include a 'Limitation of Liability' clause in their Terms of Service.",
    "GST registration becomes mandatory above ₹20 lakh turnover for most service businesses.",
    "You can voluntarily register for GST even below the threshold to appear more credible to B2B clients.",
    "Trademark registration in India now offers 'expedited processing' for a faster response.",
    "A founder vesting schedule prevents a co-founder from leaving with a large equity chunk early on.",
    "Investors rarely fund startups without at least basic legal documentation in place.",
    "A 'Notice Period' clause protects your startup from sudden employee exits.",
    "Every website in India must allow users to request deletion of their personal data.",
    "E-commerce marketplaces like Amazon deduct TCS (Tax Collected at Source) under GST rules.",
    "Your company name and trademark are not the same thing — registering one doesn't protect the other.",
    "ESOPs help startups attract talent when they can't afford high salaries.",
    "Angel investors in India receive tax benefits under Section 56 after startup recognition.",
    "A good Client Agreement can prevent late payments and scope creep.",
    "Most cybercrimes in India happen because companies lacked a basic data protection policy.",
    "Even small startups must follow India's IT Rules 2021 if they collect user data.",
    "An MoU (Memorandum of Understanding) is usually not legally binding unless drafted as a contract.",
    "India introduced a simplified compliance scheme called SPICe+ for quick company incorporation.",
    "The average startup spends more money fixing legal issues later than setting up documents early.",
    "GST rules treat digital products differently than physical goods — different tax rates may apply.",
    "A well-written vendor agreement protects your startup from poor-quality deliveries.",
    "IP (Intellectual Property) created by employees belongs to the company only if stated in writing.",
    "A Data Processing Agreement (DPA) is mandatory when a business uses third-party tools for user data.",
    "90% of Indian startups begin with a simple Private Limited Company structure.",
    "Startups that maintain clean contracts raise funding faster than those with messy paperwork.",
    "A website without Terms of Service exposes the startup to unlimited liability.",
    "India is among the top 3 countries globally in the number of registered startups.",
    "Even email communication can be considered legally binding if it contains key contract elements.",
    "A Confidentiality clause is different from an NDA — but both protect sensitive information.",
    "You can file provisional patents in India to protect an invention before fully developing it.",
    "Most startups forget to document shareholder rights — leading to disputes later.",
    "Freelancers also need contracts — verbal agreements often fail in disputes.",
    "Businesses selling both goods and services may need two different GST categories.",
    "A well-structured onboarding document reduces employee turnover significantly.",
    "A startup can be sued for misleading advertising even before it earns revenue.",
    "If your startup operates internationally, you may need a 'Data Transfer Agreement.'",
    "Many investors check legal hygiene before agreeing to even a first meeting.",
    "Even a one-person startup can create ESOPs for future hiring.",
    "Under Indian law, minors cannot enter into legally binding business contracts.",
    "A Privacy Policy must mention third-party tools (like Google Analytics) to be compliant."
];

let currentFactIndex = 0;
let factRotationInterval = null;
let progressInterval = null;

// ==========================================
// NAVIGATION FUNCTIONS
// ==========================================
function showSection(sectionId) {
    console.log('showSection called with:', sectionId);
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('Section activated:', sectionId);
    } else {
        console.error('Section not found:', sectionId);
    }
}

function startQuestionnaire() {
    console.log('startQuestionnaire called');
    showSection('questionPage');
    currentQuestionIndex = 0;
    answers = {};
    displayQuestion();
}

function startOver() {
    if (confirm('Are you sure you want to start over? This will clear all your answers.')) {
        currentQuestionIndex = 0;
        answers = {};
        generatedDocuments = null;
        showSection('landingPage');
    }
}

// ==========================================
// QUESTION DISPLAY LOGIC
// ==========================================
function displayQuestion() {
    console.log('displayQuestion called, index:', currentQuestionIndex);
    const question = questions[currentQuestionIndex];
    console.log('Question:', question);
    
    // Check if question is conditional
    if (question.conditionalOn) {
        const { field, value } = question.conditionalOn;
        if (answers[field] !== value) {
            // Skip this question
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                displayQuestion();
            } else {
                submitAnswers();
            }
            return;
        }
    }
    
    // Update progress
    updateProgress();
    
    // Update question text
    document.getElementById('questionText').textContent = question.text;
    document.getElementById('questionSubtitle').textContent = question.subtitle || '';
    
    // Hide all input types
    document.getElementById('textInput').style.display = 'none';
    document.getElementById('textareaInput').style.display = 'none';
    document.getElementById('numberInput').style.display = 'none';
    document.getElementById('buttonOptions').style.display = 'none';
    document.getElementById('checkboxOptions').style.display = 'none';
    hideOtherInput(); // Hide "Other" input if it exists
    
    // Show appropriate input type
    switch (question.type) {
        case 'text':
            document.getElementById('textInput').style.display = 'block';
            document.getElementById('textAnswer').value = answers[question.id] || '';
            document.getElementById('textAnswer').focus();
            break;
            
        case 'textarea':
            document.getElementById('textareaInput').style.display = 'block';
            document.getElementById('textareaAnswer').value = answers[question.id] || '';
            document.getElementById('textareaAnswer').focus();
            break;
            
        case 'number':
            document.getElementById('numberInput').style.display = 'block';
            const numberInput = document.getElementById('numberAnswer');
            numberInput.value = answers[question.id] || '';
            // Set min=1 for founder and employee count
            if (question.id === 'num_founders' || question.id === 'num_employees') {
                numberInput.min = '1';
            } else {
                numberInput.removeAttribute('min');
            }
            numberInput.focus();
            break;
            
        case 'buttons':
            displayButtonOptions(question);
            break;
            
        case 'checkboxes':
            displayCheckboxOptions(question);
            break;
    }
    
    // Show/hide back button
    document.getElementById('backBtn').style.display = currentQuestionIndex > 0 ? 'flex' : 'none';
    
    // Animate card entrance
    const card = document.getElementById('questionCard');
    card.style.animation = 'none';
    setTimeout(() => {
        card.style.animation = 'slideUp 0.4s ease-out';
    }, 10);
}

function displayButtonOptions(question) {
    const container = document.getElementById('buttonOptions');
    container.style.display = 'grid';
    container.innerHTML = '';
    
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => {
            selectOption(question.id, option, button);
            
            // Handle "Other" option
            if (option === 'Other' && question.allowOther) {
                showOtherInput(question.id, container);
            } else {
                hideOtherInput();
            }
        };
        
        if (answers[question.id] === option || (typeof answers[question.id] === 'string' && answers[question.id].startsWith('Other: '))) {
            button.classList.add('selected');
        }
        
        container.appendChild(button);
    });
    
    // If previous answer was "Other: something", show the input
    if (typeof answers[question.id] === 'string' && answers[question.id].startsWith('Other: ')) {
        const otherButton = Array.from(container.children).find(btn => btn.textContent === 'Other');
        if (otherButton) {
            otherButton.classList.add('selected');
            showOtherInput(question.id, container);
            const otherValue = answers[question.id].replace('Other: ', '');
            const otherInput = document.getElementById('otherTextInput');
            if (otherInput) otherInput.value = otherValue;
        }
    }
}

function showOtherInput(questionId, container) {
    hideOtherInput(); // Remove any existing input
    
    const otherWrapper = document.createElement('div');
    otherWrapper.id = 'otherInputWrapper';
    otherWrapper.className = 'answer-input';
    otherWrapper.style.marginTop = '10px';
    
    const otherInput = document.createElement('input');
    otherInput.type = 'text';
    otherInput.id = 'otherTextInput';
    otherInput.placeholder = 'Please specify...';
    otherInput.style.width = '100%';
    
    const existingValue = answers[questionId];
    if (typeof existingValue === 'string' && existingValue.startsWith('Other: ')) {
        otherInput.value = existingValue.replace('Other: ', '');
    }
    
    otherWrapper.appendChild(otherInput);
    container.parentNode.insertBefore(otherWrapper, container.nextSibling);
    
    // Save the custom value when typing
    otherInput.addEventListener('input', (e) => {
        if (e.target.value.trim()) {
            answers[questionId] = 'Other: ' + e.target.value.trim();
        } else {
            answers[questionId] = 'Other';
        }
    });
}

function hideOtherInput() {
    const existing = document.getElementById('otherInputWrapper');
    if (existing) {
        existing.remove();
    }
}

function displayCheckboxOptions(question) {
    const container = document.getElementById('checkboxOptions');
    container.style.display = 'flex';
    container.innerHTML = '';
    
    const existingAnswers = answers[question.id] || [];
    
    question.options.forEach((option, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'checkbox-option';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `checkbox_${index}`;
        checkbox.value = option;
        checkbox.checked = existingAnswers.includes(option);
        
        const label = document.createElement('label');
        label.htmlFor = `checkbox_${index}`;
        label.textContent = option;
        
        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        
        if (checkbox.checked) {
            wrapper.classList.add('selected');
        }
        
        wrapper.onclick = () => {
            checkbox.checked = !checkbox.checked;
            wrapper.classList.toggle('selected', checkbox.checked);
        };
        
        container.appendChild(wrapper);
    });
}

function selectOption(questionId, value, button) {
    answers[questionId] = value;
    
    // Update button states
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    button.classList.add('selected');
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('questionCounter').textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
}

// ==========================================
// ANSWER COLLECTION
// ==========================================
function getCurrentAnswer() {
    const question = questions[currentQuestionIndex];
    
    switch (question.type) {
        case 'text':
            return document.getElementById('textAnswer').value.trim();
            
        case 'textarea':
            return document.getElementById('textareaAnswer').value.trim();
            
        case 'number':
            return document.getElementById('numberAnswer').value;
            
        case 'buttons':
            return answers[question.id] || null;
            
        case 'checkboxes':
            const checkboxes = document.querySelectorAll('#checkboxOptions input[type="checkbox"]:checked');
            return Array.from(checkboxes).map(cb => cb.value);
    }
}

function validateAnswer(answer) {
    const question = questions[currentQuestionIndex];
    
    if (!question.required) {
        return true;
    }
    
    if (question.type === 'checkboxes') {
        return answer && answer.length > 0;
    }
    
    // Validate number inputs for founder and employee count
    if (question.type === 'number' && (question.id === 'num_founders' || question.id === 'num_employees')) {
        const num = parseInt(answer);
        if (isNaN(num) || num <= 0) {
            return false;
        }
    }
    
    return answer !== null && answer !== '' && answer !== undefined;
}

// ==========================================
// NAVIGATION HANDLERS
// ==========================================
function nextQuestion() {
    const answer = getCurrentAnswer();
    const question = questions[currentQuestionIndex];
    
    if (!validateAnswer(answer)) {
        if (question.type === 'number' && (question.id === 'num_founders' || question.id === 'num_employees')) {
            alert('Please enter a positive number (at least 1).');
        } else {
            alert('Please provide an answer before continuing.');
        }
        return;
    }
    
    // Save answer
    answers[question.id] = answer;
    
    // Move to next question or submit
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        submitAnswers();
    }
}

function goBack() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        
        // Skip conditional questions when going back
        const question = questions[currentQuestionIndex];
        if (question.conditionalOn) {
            const { field, value } = question.conditionalOn;
            if (answers[field] !== value) {
                goBack();
                return;
            }
        }
        
        displayQuestion();
    }
}

// ==========================================
// API SUBMISSION
// ==========================================
async function submitAnswers() {
    // Check if API URL is configured
    if (!isApiConfigured()) {
        alert('⚠️ API URL not configured!\n\nPlease click the settings icon (⚙️) in the top left corner and enter your ngrok URL from Google Colab.');
        return;
    }
    
    showSection('loadingPage');
    animateLoadingSteps();
    
    try {
        // Format answers for the prompt
        const prompt = buildPrompt(answers);
        
        const colabApiUrl = getApiUrl();
        const response = await fetch(`${API_URL}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                max_new_tokens: 4096,
                temperature: 0.7,
                top_p: 0.9,
                colab_api_url: colabApiUrl  // Send the colab URL to the backend
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: response.statusText }));
            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Parse the generated text as JSON
        const generatedText = data.generated_text;
        generatedDocuments = parseGeneratedDocuments(generatedText);
        
        // Display results
        displayResults();
        
    } catch (error) {
        console.error('Error:', error);
        alert(`Error generating documents: ${error.message}\n\nPlease check:\n1. Your ngrok URL is correct in settings\n2. Google Colab notebook is running\n3. ngrok tunnel is active`);
        showSection('questionPage');
    }
}

function buildPrompt(answers) {
    // Build a structured prompt based on the answers
    let prompt = `You are a legal document advisor for startups. Based on the following information about a startup, generate a comprehensive JSON list of required legal documents.\n\n`;
    
    prompt += `STARTUP INFORMATION:\n`;
    prompt += `- Name: ${answers.startup_name}\n`;
    prompt += `- Industry: ${answers.industry}\n`;
    prompt += `- Description: ${answers.description}\n`;
    prompt += `- Company Structure: ${answers.company_structure}\n`;
    prompt += `- Number of Founders: ${answers.num_founders}\n`;
    prompt += `- Has Founder Agreement: ${answers.founder_agreement}\n`;
    prompt += `- Consider Ownership Splits: ${answers.ownership_splits}\n`;
    prompt += `- Has Employees: ${answers.has_employees}\n`;
    
    if (answers.num_employees) {
        prompt += `- Number of Employees: ${answers.num_employees}\n`;
    }
    
    prompt += `- Plans to Hire: ${answers.plan_to_hire}\n`;
    prompt += `- Product Type: ${answers.product_type}\n`;
    prompt += `- Collects User Data: ${answers.collects_user_data}\n`;
    
    if (answers.data_type) {
        prompt += `- Data Types: ${Array.isArray(answers.data_type) ? answers.data_type.join(', ') : answers.data_type}\n`;
    }
    
    prompt += `- Primary Customers: ${answers.primary_customers}\n`;
    prompt += `- Works with Vendors: ${answers.has_vendors}\n`;
    prompt += `- Client Contracts: ${answers.client_contracts}\n`;
    prompt += `- Has Intellectual Property: ${answers.has_ip}\n`;
    
    if (answers.ip_types) {
        prompt += `- IP Types: ${Array.isArray(answers.ip_types) ? answers.ip_types.join(', ') : answers.ip_types}\n`;
    }
    
    prompt += `- Startup Stage: ${answers.startup_stage}\n`;
    prompt += `- Raising Funds: ${answers.raising_funds}\n`;
    
    if (answers.funding_type) {
        prompt += `- Funding Type: ${answers.funding_type}\n`;
    }
    
    prompt += `- Considering ESOPs: ${answers.considering_esops}\n`;
    prompt += `- Regulated Industries: ${Array.isArray(answers.regulated_industry) ? answers.regulated_industry.join(', ') : answers.regulated_industry}\n`;
    prompt += `- Operates Internationally: ${answers.operates_internationally}\n`;
    
    if (answers.countries) {
        prompt += `- Countries: ${answers.countries}\n`;
    }
    
    prompt += `- Turnover Exceeds 20L: ${answers.turnover_exceeds_20l}\n`;
    prompt += `- Sells: ${answers.sells_products_services}\n`;
    prompt += `- Sells Outside India: ${answers.sells_outside_india}\n`;
    prompt += `- Sells Through Platforms: ${answers.sells_through_platforms}\n`;
    prompt += `- Buys for Business: ${answers.buys_for_business}\n`;
    prompt += `- GST Registration Timing: ${answers.gst_registration_timing}\n\n`;
    
    prompt += `Generate a JSON array of document objects with the following structure:\n`;
    prompt += `[\n`;
    prompt += `  {\n`;
    prompt += `    "name": "Document Name",\n`;
    prompt += `    "description": "Brief description of what this document does",\n`;
    prompt += `    "why_needed": "Why this startup specifically needs this document",\n`;
    prompt += `    "risk_if_missing": "What risks the startup faces without this document",\n`;
    prompt += `    "priority": "critical|high|medium|low",\n`;
    prompt += `    "category": "legal|compliance|financial|operational|ip",\n`;
    prompt += `    "stakeholders": ["stakeholder1", "stakeholder2"],\n`;
    prompt += `    "is_optional": false\n`;
    prompt += `  }\n`;
    prompt += `]\n\n`;
    prompt += `Return ONLY the JSON array, no additional text.`;
    
    return prompt;
}

function parseGeneratedDocuments(text) {
    try {
        // Try to find JSON in the text
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        // If no JSON found, try parsing the whole text
        return JSON.parse(text);
    } catch (error) {
        console.error('Error parsing JSON:', error);
        console.log('Generated text:', text);
        
        // Return a fallback structure
        return [
            {
                name: "Error Parsing Response",
                description: "The AI generated a response but it couldn't be parsed. Please try again.",
                why_needed: "N/A",
                risk_if_missing: "N/A",
                priority: "high",
                category: "legal",
                stakeholders: [],
                is_optional: false
            }
        ];
    }
}

function animateLoadingSteps() {
    // Start folder animation
    startFolderAnimation();
    
    // Start progress bar
    startProgressBar();
    
    // Start rotating facts
    startRotatingFacts();
}

function startFolderAnimation() {
    const container = document.getElementById('flyingDocs');
    container.innerHTML = '';
    
    // Document icons/emojis to fly into the folder
    const docIcons = ['📄', '📋', '📝', '📑', '📃', '🗂️', '📊', '📈', '✍️', '🔒', '⚖️', '💼'];
    
    let docIndex = 0;
    const docInterval = setInterval(() => {
        if (docIndex >= docIcons.length) {
            clearInterval(docInterval);
            return;
        }
        
        const doc = document.createElement('div');
        doc.className = 'flying-doc';
        doc.textContent = docIcons[docIndex];
        doc.style.left = `${Math.random() * 60 + 20}%`;
        doc.style.animationDelay = `${docIndex * 0.3}s`;
        
        container.appendChild(doc);
        
        // Remove after animation
        setTimeout(() => {
            if (doc.parentNode) {
                doc.remove();
            }
        }, 2000);
        
        docIndex++;
    }, 500);
}

function startProgressBar() {
    const progressFill = document.getElementById('loadingProgressFill');
    const progressText = document.getElementById('loadingProgressText');
    let progress = 0;
    
    // Clear any existing interval
    if (progressInterval) {
        clearInterval(progressInterval);
    }
    
    progressInterval = setInterval(() => {
        progress += 1;
        if (progress > 95) {
            // Slow down near the end
            if (Math.random() > 0.7) {
                progress += 1;
            }
        }
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
        }
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;
    }, 100);
}

function startRotatingFacts() {
    const factText = document.getElementById('factText');
    currentFactIndex = 0;
    
    // Display first fact immediately
    factText.textContent = legalFacts[currentFactIndex];
    factText.style.animation = 'fadeIn 0.5s ease-in';
    
    // Clear any existing interval
    if (factRotationInterval) {
        clearInterval(factRotationInterval);
    }
    
    // Rotate facts every 5 seconds
    factRotationInterval = setInterval(() => {
        currentFactIndex = (currentFactIndex + 1) % legalFacts.length;
        
        // Fade out
        factText.style.animation = 'fadeOut 0.3s ease-out';
        
        setTimeout(() => {
            factText.textContent = legalFacts[currentFactIndex];
            factText.style.animation = 'fadeIn 0.5s ease-in';
        }, 300);
    }, 5000);
}

function stopLoadingAnimations() {
    if (factRotationInterval) {
        clearInterval(factRotationInterval);
        factRotationInterval = null;
    }
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
}

// ==========================================
// RESULTS DISPLAY
// ==========================================
function displayResults() {
    stopLoadingAnimations();
    showSection('resultsPage');
    
    const requiredDocs = generatedDocuments.filter(doc => !doc.is_optional);
    const optionalDocs = generatedDocuments.filter(doc => doc.is_optional);
    
    // Display required documents
    const grid = document.getElementById('documentsGrid');
    grid.innerHTML = '';
    
    requiredDocs.forEach((doc, index) => {
        const card = createDocumentCard(doc, index);
        grid.appendChild(card);
    });
    
    // Display optional documents if any
    if (optionalDocs.length > 0) {
        document.getElementById('optionalSection').style.display = 'block';
        const optionalGrid = document.getElementById('optionalDocumentsGrid');
        optionalGrid.innerHTML = '';
        
        optionalDocs.forEach((doc, index) => {
            const card = createDocumentCard(doc, index + requiredDocs.length);
            optionalGrid.appendChild(card);
        });
    } else {
        document.getElementById('optionalSection').style.display = 'none';
    }
}

function createDocumentCard(doc, index) {
    const card = document.createElement('div');
    card.className = 'document-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const priorityClass = doc.priority.toLowerCase();
    
    card.innerHTML = `
        <div class="card-header">
            <h3 class="card-title">${doc.name}</h3>
            <span class="priority-badge ${priorityClass}">${doc.priority}</span>
        </div>
        <span class="category-badge">${doc.category}</span>
        <p class="card-description">${doc.description}</p>
        
        <div class="card-section">
            <div class="card-section-title">Why You Need This</div>
            <div class="card-section-content">${doc.why_needed}</div>
        </div>
        
        <div class="card-section">
            <div class="card-section-title">Risk If Missing</div>
            <div class="card-section-content risk">${doc.risk_if_missing}</div>
        </div>
        
        ${doc.stakeholders && doc.stakeholders.length > 0 ? `
        <div class="card-section">
            <div class="card-section-title">Stakeholders</div>
            <div class="stakeholders-list">
                ${doc.stakeholders.map(s => `<span class="stakeholder-tag">${s}</span>`).join('')}
            </div>
        </div>
        ` : ''}
    `;
    
    return card;
}

// ==========================================
// PDF GENERATION
// ==========================================
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let yPos = 20;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(26, 35, 126);
    doc.text('Legal Document Requirements', margin, yPos);
    yPos += 15;
    
    // Startup info
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`${answers.startup_name} - ${answers.industry}`, margin, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, yPos);
    yPos += 15;
    
    // Documents
    const requiredDocs = generatedDocuments.filter(doc => !doc.is_optional);
    const optionalDocs = generatedDocuments.filter(doc => doc.is_optional);
    
    // Required documents
    doc.setFontSize(14);
    doc.setTextColor(26, 35, 126);
    doc.text('Required Documents', margin, yPos);
    yPos += 10;
    
    requiredDocs.forEach((document, index) => {
        // Check if we need a new page
        if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = 20;
        }
        
        // Document number and name
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`${index + 1}. ${document.name}`, margin, yPos);
        yPos += lineHeight;
        
        // Priority badge
        doc.setFontSize(9);
        const priorityColors = {
            critical: [239, 68, 68],
            high: [245, 158, 11],
            medium: [59, 130, 246],
            low: [16, 185, 129]
        };
        const color = priorityColors[document.priority.toLowerCase()] || [100, 100, 100];
        doc.setTextColor(...color);
        doc.text(`Priority: ${document.priority.toUpperCase()}`, margin + 5, yPos);
        yPos += lineHeight;
        
        // Description
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        const descLines = doc.splitTextToSize(document.description, 170);
        doc.text(descLines, margin + 5, yPos);
        yPos += descLines.length * lineHeight;
        
        yPos += 5;
    });
    
    // Optional documents
    if (optionalDocs.length > 0) {
        if (yPos > pageHeight - 60) {
            doc.addPage();
            yPos = 20;
        }
        
        yPos += 10;
        doc.setFontSize(14);
        doc.setTextColor(26, 35, 126);
        doc.text('Optional Documents', margin, yPos);
        yPos += 10;
        
        optionalDocs.forEach((document, index) => {
            if (yPos > pageHeight - 40) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`${index + 1}. ${document.name}`, margin, yPos);
            yPos += lineHeight;
            
            doc.setFontSize(10);
            doc.setTextColor(80, 80, 80);
            const descLines = doc.splitTextToSize(document.description, 170);
            doc.text(descLines, margin + 5, yPos);
            yPos += descLines.length * lineHeight + 5;
        });
    }
    
    // Footer on last page
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            'Generated by LegalDocs AI - This is informational guidance only, not legal advice',
            margin,
            pageHeight - 10
        );
        doc.text(`Page ${i} of ${totalPages}`, pageHeight - margin, pageHeight - 10);
    }
    
    doc.save(`${answers.startup_name}_legal_documents.pdf`);
}

// ==========================================
// REGENERATE
// ==========================================
async function regenerate() {
    if (confirm('This will generate a new document list with the same answers. Continue?')) {
        await submitAnswers();
    }
}

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        const activeSection = document.querySelector('.section.active');
        if (activeSection && activeSection.id === 'questionPage') {
            const question = questions[currentQuestionIndex];
            if (question.type === 'text' || question.type === 'number') {
                e.preventDefault();
                nextQuestion();
            }
        }
    }
});

// ==========================================
// INITIALIZE
// ==========================================
console.log('LegalDocs AI initialized');
console.log(`Total questions: ${questions.length}`);

// Initialize API URL on page load
initializeApiUrl();
