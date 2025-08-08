import "whatwg-fetch";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "@/components/sections/Login/Login";
import { toast } from "sonner";

// ✅ MOCK the Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    message: jest.fn(),
  },
}));

jest.mock("@/lib/firebase", () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
  },
  db: {},
  storage: {},
  provider: {},
  app: {},
}));

describe("Login", () => {
  it("returns error when password is missing", async () => {
    render(<Login />);
    const email = screen.getByLabelText(/email/i);
    const button = screen.getByRole("button", { name: /Log in/i });

    fireEvent.change(email, { target: { value: "username@gmail.com" } });
    fireEvent.click(button);

    // Wait for error message to appear (assuming you render it)
    await screen.findByLabelText(/password/i); // adjust based on your actual UI

    expect(toast.error).toHaveBeenCalledWith(
      expect.stringMatching(/password/i)
    );
  });
});
