
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "./types";

/**
 * Send an email notification for a lead match
 */
export const sendLeadMatchEmail = async (
  freelancerId: string,
  projectId: string,
  email: string,
  name: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke("send-email/lead-match", {
      body: {
        freelancerId,
        projectId,
        email,
        name
      }
    });
    
    if (error) {
      console.error("Error sending lead match email:", error);
      return false;
    }
    
    console.log("Lead match email sent successfully:", data);
    return true;
  } catch (error) {
    console.error("Error in sendLeadMatchEmail:", error);
    return false;
  }
};

/**
 * Send an email for a notification
 */
export const sendNotificationEmail = async (
  userId: string,
  email: string,
  notification: Notification
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke("send-email/notification", {
      body: {
        userId,
        email,
        notificationType: notification.type,
        title: notification.title,
        description: notification.description,
        data: notification.data
      }
    });
    
    if (error) {
      console.error("Error sending notification email:", error);
      return false;
    }
    
    console.log("Notification email sent successfully:", data);
    return true;
  } catch (error) {
    console.error("Error in sendNotificationEmail:", error);
    return false;
  }
};

/**
 * Send a custom email
 */
export const sendCustomEmail = async (
  to: string | string[],
  subject: string,
  html: string,
  options?: {
    from?: string;
    text?: string;
    replyTo?: string;
  }
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke("send-email/custom", {
      body: {
        to,
        subject,
        html,
        ...options
      }
    });
    
    if (error) {
      console.error("Error sending custom email:", error);
      return false;
    }
    
    console.log("Custom email sent successfully:", data);
    return true;
  } catch (error) {
    console.error("Error in sendCustomEmail:", error);
    return false;
  }
};
