// Application Data
const appData = {
  platform_name: "CITIZEN AI - INTELLIGENT CITIZEN ENGAGEMENT PLATFORM",
  sample_queries: [
    "How do I apply for a passport?",
    "What are the tax filing deadlines?", 
    "How to report a road issue?",
    "Where can I get voter ID card?",
    "How to apply for government jobs?",
    "What documents needed for driving license?"
  ],
  sample_responses: [
    "To apply for a passport, visit your nearest Passport Seva Kendra with required documents including proof of identity, address proof, and birth certificate. You can also apply online at passportindia.gov.in",
    "Tax filing deadline for individuals is July 31st for the current financial year. For businesses, it's September 30th. Extensions may be available in special circumstances.",
    "To report road issues, you can use our online portal, call the municipal helpline, or submit through this platform. Include location details and photos if possible.",
    "Voter ID cards can be obtained by applying online at nvsp.in or visiting your local election office with proof of identity and residence.",
    "Government job applications are available at ssc.nic.in, upsc.gov.in, and respective department websites. Check eligibility criteria and application deadlines.",
    "For driving license, you need age proof, address proof, medical certificate, and passport-size photos. Apply online or visit RTO office."
  ],
  sentiment_keywords: {
    positive: ["good", "excellent", "satisfied", "happy", "great", "wonderful", "amazing", "helpful", "efficient", "quick"],
    negative: ["bad", "terrible", "disappointed", "angry", "frustrated", "slow", "unhelpful", "poor", "worst", "horrible"],
    neutral: ["okay", "fine", "average", "normal", "standard", "regular", "typical"]
  }
};

// Global state
let chatHistory = [];
let feedbackHistory = [];
let chartsInitialized = false;
let dashboardData = {
  totalInteractions: 1247,
  avgSentiment: 7.2,
  activeIssues: 23,
  sentimentDistribution: { positive: 45, neutral: 35, negative: 20 },
  interactionTrends: [120, 135, 140, 125, 160, 145, 155],
  serviceRatings: {
    'Passport Services': 8.2,
    'Tax Services': 7.1,
    'Transport Services': 6.8,
    'Healthcare Services': 7.5,
    'Education Services': 8.0
  }
};

// Navigation functionality
function initializeNavigation() {
  console.log('Initializing navigation...');
  const navButtons = document.querySelectorAll('.nav-btn');
  console.log('Found nav buttons:', navButtons.length);
  
  navButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionName = button.getAttribute('data-section');
      console.log('Nav button clicked:', sectionName);
      showSection(sectionName);
      
      // Update active nav button
      navButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // Initialize feature card navigation
  const featureCards = document.querySelectorAll('.feature-card');
  console.log('Found feature cards:', featureCards.length);
  
  featureCards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      let sectionName;
      if (index === 0) sectionName = 'chat';
      else if (index === 1) sectionName = 'sentiment';
      else if (index === 2) sectionName = 'dashboard';
      
      console.log('Feature card clicked:', sectionName);
      showSection(sectionName);
      
      // Update nav button
      navButtons.forEach(btn => {
        if (btn.getAttribute('data-section') === sectionName) {
          navButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
      });
    });
  });
}

function showSection(sectionName) {
  console.log('Showing section:', sectionName);
  const sections = document.querySelectorAll('.section');
  
  sections.forEach(section => {
    section.classList.remove('active');
    section.style.display = 'none';
  });
  
  const targetSection = document.getElementById(sectionName);
  if (targetSection) {
    targetSection.classList.add('active');
    targetSection.style.display = 'block';
    console.log('Section shown:', sectionName);
    
    // Initialize section-specific functionality
    if (sectionName === 'dashboard') {
      setTimeout(() => {
        initializeDashboard();
      }, 100);
    }
  } else {
    console.error('Section not found:', sectionName);
  }
}

// Chat Assistant functionality
function initializeChatAssistant() {
  console.log('Initializing chat assistant...');
  const sendBtn = document.getElementById('sendBtn');
  const chatInput = document.getElementById('chatInput');
  
  if (sendBtn && chatInput) {
    sendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sendMessage();
    });
    
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
    console.log('Chat assistant initialized');
  } else {
    console.error('Chat elements not found');
  }
}

// Make sendSuggestedQuery available globally
window.sendSuggestedQuery = function(query) {
  console.log('Sending suggested query:', query);
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.value = query;
    sendMessage();
  }
}

function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  const message = chatInput.value.trim();
  
  if (!message) return;
  
  console.log('Sending message:', message);
  
  // Add user message to chat
  addMessageToChat(message, 'user');
  
  // Clear input
  chatInput.value = '';
  
  // Show typing indicator and respond after delay
  showTypingIndicator();
  setTimeout(() => {
    const response = getAIResponse(message);
    addMessageToChat(response, 'bot');
    hideTypingIndicator();
    
    // Update dashboard data
    dashboardData.totalInteractions++;
    updateMetrics();
  }, 1500);
}

function addMessageToChat(message, sender) {
  const chatMessages = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.className = `message ${sender}-message`;
  
  messageElement.innerHTML = `
    <div class="message-content">
      <p>${message}</p>
    </div>
  `;
  
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Store in chat history
  chatHistory.push({ message, sender, timestamp: new Date() });
}

function getAIResponse(query) {
  const lowerQuery = query.toLowerCase();
  
  // Check for keyword matches
  if (lowerQuery.includes('passport')) {
    return appData.sample_responses[0];
  } else if (lowerQuery.includes('tax') || lowerQuery.includes('filing')) {
    return appData.sample_responses[1];
  } else if (lowerQuery.includes('road') || lowerQuery.includes('report')) {
    return appData.sample_responses[2];
  } else if (lowerQuery.includes('voter') || lowerQuery.includes('id card')) {
    return appData.sample_responses[3];
  } else if (lowerQuery.includes('job') || lowerQuery.includes('employment')) {
    return appData.sample_responses[4];
  } else if (lowerQuery.includes('driving') || lowerQuery.includes('license')) {
    return appData.sample_responses[5];
  } else {
    // Default responses
    const defaultResponses = [
      "Thank you for your query. For specific information about government services, please contact the relevant department or visit our official website.",
      "I'm here to help with government service queries. Could you please be more specific about which service you need assistance with?",
      "For detailed information about government procedures, I recommend visiting the official government portal or contacting the concerned office directly.",
      "If you need immediate assistance, please call our helpline or visit the nearest government service center. Is there anything specific I can help you with?"
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }
}

function showTypingIndicator() {
  const chatMessages = document.getElementById('chatMessages');
  const typingElement = document.createElement('div');
  typingElement.className = 'message bot-message typing-indicator';
  typingElement.innerHTML = `
    <div class="message-content">
      <p>AI is typing...</p>
    </div>
  `;
  chatMessages.appendChild(typingElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
  const typingIndicator = document.querySelector('.typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Sentiment Analysis functionality
function initializeSentimentAnalysis() {
  console.log('Initializing sentiment analysis...');
  const analyzeBtn = document.getElementById('analyzeSentiment');
  
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      analyzeSentiment();
    });
    console.log('Sentiment analysis initialized');
  }
}

// Make loadSample available globally
window.loadSample = function(sampleText) {
  console.log('Loading sample:', sampleText);
  const feedbackText = document.getElementById('feedbackText');
  if (feedbackText) {
    feedbackText.value = sampleText;
    console.log('Sample loaded successfully');
  } else {
    console.error('Feedback text element not found');
  }
}

function analyzeSentiment() {
  console.log('Analyzing sentiment...');
  const feedbackText = document.getElementById('feedbackText');
  const serviceType = document.getElementById('serviceType');
  
  if (!feedbackText || !serviceType) {
    console.error('Form elements not found');
    return;
  }
  
  const feedback = feedbackText.value.trim();
  const service = serviceType.value;
  
  if (!feedback) {
    alert('Please enter your feedback before analyzing.');
    return;
  }
  
  const result = performSentimentAnalysis(feedback);
  console.log('Sentiment result:', result);
  displaySentimentResult(result);
  
  // Store feedback
  feedbackHistory.push({
    text: feedback,
    service: service,
    sentiment: result.sentiment,
    confidence: result.confidence,
    timestamp: new Date()
  });
  
  // Update dashboard data
  updateSentimentDistribution(result.sentiment);
  dashboardData.totalInteractions++;
  updateMetrics();
}

function performSentimentAnalysis(text) {
  const lowerText = text.toLowerCase();
  let positiveScore = 0;
  let negativeScore = 0;
  let neutralScore = 0;
  
  // Count positive keywords
  appData.sentiment_keywords.positive.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      positiveScore += 1;
    }
  });
  
  // Count negative keywords
  appData.sentiment_keywords.negative.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      negativeScore += 1;
    }
  });
  
  // Count neutral keywords
  appData.sentiment_keywords.neutral.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      neutralScore += 1;
    }
  });
  
  // Determine sentiment
  let sentiment = 'neutral';
  let confidence = 50;
  
  if (positiveScore > negativeScore && positiveScore > neutralScore) {
    sentiment = 'positive';
    confidence = Math.min(70 + positiveScore * 10, 95);
  } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
    sentiment = 'negative';
    confidence = Math.min(70 + negativeScore * 10, 95);
  } else {
    confidence = 60 + neutralScore * 5;
  }
  
  return { sentiment, confidence };
}

function displaySentimentResult(result) {
  const resultDiv = document.getElementById('sentimentResult');
  const badge = document.getElementById('sentimentBadge');
  const label = document.getElementById('sentimentLabel');
  const confidence = document.getElementById('sentimentConfidence');
  
  if (resultDiv && badge && label && confidence) {
    resultDiv.classList.remove('hidden');
    resultDiv.style.display = 'block';
    badge.className = `sentiment-badge ${result.sentiment}`;
    badge.textContent = result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1);
    label.textContent = result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1);
    confidence.textContent = result.confidence;
    console.log('Sentiment result displayed');
  }
}

function updateSentimentDistribution(sentiment) {
  if (sentiment === 'positive') {
    dashboardData.sentimentDistribution.positive++;
  } else if (sentiment === 'negative') {
    dashboardData.sentimentDistribution.negative++;
  } else {
    dashboardData.sentimentDistribution.neutral++;
  }
  
  // Normalize percentages
  const total = dashboardData.sentimentDistribution.positive + 
                dashboardData.sentimentDistribution.neutral + 
                dashboardData.sentimentDistribution.negative;
  
  dashboardData.sentimentDistribution = {
    positive: Math.round((dashboardData.sentimentDistribution.positive / total) * 100),
    neutral: Math.round((dashboardData.sentimentDistribution.neutral / total) * 100),
    negative: Math.round((dashboardData.sentimentDistribution.negative / total) * 100)
  };
}

// Dashboard functionality
function initializeDashboard() {
  console.log('Initializing dashboard...');
  if (!chartsInitialized) {
    createCharts();
    chartsInitialized = true;
  }
  updateMetrics();
}

function createCharts() {
  console.log('Creating charts...');
  
  try {
    // Sentiment Distribution Pie Chart
    const sentimentCtx = document.getElementById('sentimentChart');
    if (sentimentCtx) {
      new Chart(sentimentCtx.getContext('2d'), {
        type: 'pie',
        data: {
          labels: ['Positive', 'Neutral', 'Negative'],
          datasets: [{
            data: [
              dashboardData.sentimentDistribution.positive,
              dashboardData.sentimentDistribution.neutral,
              dashboardData.sentimentDistribution.negative
            ],
            backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
    
    // Interaction Trends Line Chart
    const trendsCtx = document.getElementById('trendsChart');
    if (trendsCtx) {
      new Chart(trendsCtx.getContext('2d'), {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Daily Interactions',
            data: dashboardData.interactionTrends,
            borderColor: '#1FB8CD',
            backgroundColor: 'rgba(31, 184, 205, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }
    
    // Service Ratings Bar Chart
    const ratingsCtx = document.getElementById('ratingsChart');
    if (ratingsCtx) {
      new Chart(ratingsCtx.getContext('2d'), {
        type: 'bar',
        data: {
          labels: Object.keys(dashboardData.serviceRatings),
          datasets: [{
            label: 'Rating (out of 10)',
            data: Object.values(dashboardData.serviceRatings),
            backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 10
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }
    
    console.log('Charts created successfully');
  } catch (error) {
    console.error('Error creating charts:', error);
  }
}

function updateMetrics() {
  const totalInteractionsEl = document.getElementById('totalInteractions');
  const avgSentimentEl = document.getElementById('avgSentiment');
  const activeIssuesEl = document.getElementById('activeIssues');
  
  if (totalInteractionsEl) {
    totalInteractionsEl.textContent = dashboardData.totalInteractions.toLocaleString();
  }
  if (avgSentimentEl) {
    avgSentimentEl.textContent = `${dashboardData.avgSentiment}/10`;
  }
  if (activeIssuesEl) {
    activeIssuesEl.textContent = dashboardData.activeIssues;
  }
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded - Initializing application...');
  
  // Initialize all functionality
  initializeNavigation();
  initializeChatAssistant();
  initializeSentimentAnalysis();
  
  // Show landing page by default
  showSection('landing');
  
  console.log('Application initialized successfully');
});