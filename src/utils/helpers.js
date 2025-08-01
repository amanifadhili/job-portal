// Utility functions for the Job Portal application

// Filter job seekers based on search criteria
export const filterJobSeekers = (jobSeekers, filters) => {
  return jobSeekers.filter(seeker => {
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        seeker.name.toLowerCase().includes(searchLower) ||
        seeker.title.toLowerCase().includes(searchLower) ||
        seeker.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
        seeker.bio.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Location filter
    if (filters.location && filters.location !== 'All Locations') {
      if (seeker.location !== filters.location) return false;
    }

    // Category filter
    if (filters.category && filters.category !== 'All Categories') {
      if (seeker.category !== filters.category.toLowerCase()) return false;
    }

    // Experience filter
    if (filters.experience && filters.experience !== 'All Experience') {
      const experienceRange = filters.experience;
      const seekerExp = seeker.experience;
      
      switch (experienceRange) {
        case '0-1 years':
          if (seekerExp > 1) return false;
          break;
        case '1-3 years':
          if (seekerExp < 1 || seekerExp > 3) return false;
          break;
        case '3-5 years':
          if (seekerExp < 3 || seekerExp > 5) return false;
          break;
        case '5-10 years':
          if (seekerExp < 5 || seekerExp > 10) return false;
          break;
        case '10+ years':
          if (seekerExp < 10) return false;
          break;
      }
    }

    // Daily Rate Range filter
    if (filters.dailyRateRange && filters.dailyRateRange !== 'All Rates') {
      const dailyRate = seeker.dailyRate || 0;
      
      switch (filters.dailyRateRange) {
        case 'Under 3,000 RWF/day':
          if (dailyRate >= 3000) return false;
          break;
        case '3,000 - 5,000 RWF/day':
          if (dailyRate < 3000 || dailyRate > 5000) return false;
          break;
        case '5,000 - 7,000 RWF/day':
          if (dailyRate < 5000 || dailyRate > 7000) return false;
          break;
        case '7,000 - 10,000 RWF/day':
          if (dailyRate < 7000 || dailyRate > 10000) return false;
          break;
        case 'Over 10,000 RWF/day':
          if (dailyRate <= 10000) return false;
          break;
      }
    }

    // Monthly Rate Range filter
    if (filters.monthlyRateRange && filters.monthlyRateRange !== 'All Monthly Rates') {
      const monthlyRate = seeker.monthlyRate || 0;
      
      switch (filters.monthlyRateRange) {
        case 'Under 80,000 RWF/month':
          if (monthlyRate >= 80000) return false;
          break;
        case '80,000 - 120,000 RWF/month':
          if (monthlyRate < 80000 || monthlyRate > 120000) return false;
          break;
        case '120,000 - 180,000 RWF/month':
          if (monthlyRate < 120000 || monthlyRate > 180000) return false;
          break;
        case '180,000 - 250,000 RWF/month':
          if (monthlyRate < 180000 || monthlyRate > 250000) return false;
          break;
        case 'Over 250,000 RWF/month':
          if (monthlyRate <= 250000) return false;
          break;
      }
    }

    // Availability filter
    if (filters.availability && filters.availability !== 'All Availability') {
      if (seeker.availability !== filters.availability) return false;
    }

    // Education filter
    if (filters.education && filters.education !== 'All Education') {
      if (seeker.education !== filters.education) return false;
    }

    // Skills filter
    if (filters.skills && filters.skills.length > 0) {
      const hasMatchingSkill = filters.skills.some(skill => 
        seeker.skills.some(seekerSkill => 
          seekerSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      if (!hasMatchingSkill) return false;
    }

    return true;
  });
};

// Sort job seekers based on criteria
export const sortJobSeekers = (jobSeekers, sortBy) => {
  const sorted = [...jobSeekers];
  
  switch (sortBy) {
    case 'Most Recent':
      // Assuming we have a createdAt field, for now sort by ID
      return sorted.sort((a, b) => b.id - a.id);
    
    case 'Highest Rated':
      return sorted.sort((a, b) => b.rating - a.rating);
    
    case 'Most Experienced':
      return sorted.sort((a, b) => b.experience - a.experience);
    
    case 'Name A-Z':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    
    case 'Lowest Rate':
      return sorted.sort((a, b) => (a.dailyRate || 0) - (b.dailyRate || 0));
    
    case 'Highest Rate':
      return sorted.sort((a, b) => (b.dailyRate || 0) - (a.dailyRate || 0));
    
    default:
      return sorted;
  }
};

// Format experience text
export const formatExperience = (years) => {
  if (years === 1) return '1 year';
  return `${years} years`;
};

// Format daily rate
export const formatDailyRate = (rate) => {
  if (!rate || isNaN(rate)) return 'Rate not specified';
  return `${rate.toLocaleString()} RWF/day`;
};

// Format monthly rate
export const formatMonthlyRate = (rate) => {
  if (!rate || isNaN(rate)) return 'Rate not specified';
  return `${rate.toLocaleString()} RWF/month`;
};

// Format rate display (shows both daily and monthly)
export const formatRateDisplay = (dailyRate, monthlyRate) => {
  const daily = dailyRate && !isNaN(dailyRate) ? dailyRate.toLocaleString() : 'Not specified';
  const monthly = monthlyRate && !isNaN(monthlyRate) ? monthlyRate.toLocaleString() : 'Not specified';
  return `${daily} RWF/day • ${monthly} RWF/month`;
};

// Format hourly rate (for backward compatibility)
export const formatHourlyRate = (rate) => {
  return `$${rate}/hr`;
};

// Generate initials from name
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') {
    return '';
  }
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  // Handle null, undefined, or non-string values
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return '';
  }
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if can't format
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

// Calculate average rating
export const calculateAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Get time ago
export const getTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}; 