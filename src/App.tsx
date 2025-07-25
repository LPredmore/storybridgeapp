import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DebugToggle } from "@/components/DebugToggle";
import { EmergencyDebugActivator } from "@/components/EmergencyDebugActivator";
import { debugLogger } from "@/utils/debugLogger";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";

// Route logging component
const RouteLogger = () => {
  const location = useLocation();
  
  useEffect(() => {
    debugLogger.logRouting('INFO', 'Route changed', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state
    });
  }, [location]);
  
  return null;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        debugLogger.logNetwork('WARN', 'Query retry', { failureCount, error: error.message });
        return failureCount < 3;
      },
    },
  },
});

const App = () => {
  useEffect(() => {
    debugLogger.logLifecycle('INFO', 'App component mounted');
    debugLogger.markPerformance('app-component-mount');
    
    return () => {
      debugLogger.logLifecycle('INFO', 'App component unmounting');
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <DebugToggle />
            <EmergencyDebugActivator />
            <BrowserRouter>
              <RouteLogger />
              <Routes>
                <Route
                  path="/"
                  element={
                    <AuthGuard>
                      <Index />
                    </AuthGuard>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route 
                  path="/profile" 
                  element={
                    <AuthGuard>
                      <Profile />
                    </AuthGuard>
                  } 
                />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;