
import { Toast, ToasterToast } from "./types"
import { dispatch } from "./reducer"

// Simple ID generator
let count = 0

export function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

// Extend ToastProps interface to include success variant
declare module "@/components/ui/toast" {
  interface ToastProps {
    variant?: "default" | "destructive" | "success";
  }
}

// Main toast function
export function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
    
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}
