
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const useFreelancerTabs = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get('tab');

  // Get the active tab from URL parameter, localStorage, or default to 'available'
  const getInitialTab = () => {
    if (tabParam && ['available', 'leads', 'quotes', 'active', 'messages'].includes(tabParam)) {
      return tabParam;
    }
    
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('freelancer-active-tab');
      return savedTab || 'available';
    }
    return 'available';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  // Get any additional query parameters that need to be preserved
  const getAdditionalQueryParams = () => {
    const conversationId = searchParams.get('conversation');
    const projectId = searchParams.get('projectId');
    const clientId = searchParams.get('clientId');
    
    let additionalParams = '';
    if (conversationId) additionalParams += `&conversation=${conversationId}`;
    if (projectId) additionalParams += `&projectId=${projectId}`;
    if (clientId) additionalParams += `&clientId=${clientId}`;
    
    return additionalParams;
  };

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/dashboard/freelancer?tab=${value}${getAdditionalQueryParams()}`);
  };

  // Save the active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('freelancer-active-tab', activeTab);
  }, [activeTab]);

  // Update tab when URL parameter changes
  useEffect(() => {
    if (tabParam && ['available', 'leads', 'quotes', 'active', 'messages'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return {
    activeTab,
    handleTabChange,
  };
};
