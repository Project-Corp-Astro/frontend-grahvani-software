import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@/test/test-utils";
import { ApiErrorFallback } from "./ApiErrorFallback";

describe("ApiErrorFallback", () => {
  it("renders default title", () => {
    render(<ApiErrorFallback error={null} />);
    expect(screen.getByText("Failed to load data")).toBeInTheDocument();
  });

  it("renders custom title", () => {
    render(<ApiErrorFallback error={null} title="Custom Error" />);
    expect(screen.getByText("Custom Error")).toBeInTheDocument();
  });

  it("renders error message from error object", () => {
    render(<ApiErrorFallback error={new Error("Something broke")} />);
    expect(screen.getByText("Something broke")).toBeInTheDocument();
  });

  it("renders custom message over error message", () => {
    render(
      <ApiErrorFallback
        error={new Error("Something broke")}
        message="Custom message"
      />,
    );
    expect(screen.getByText("Custom message")).toBeInTheDocument();
  });

  it("renders retry button when onRetry provided", () => {
    const onRetry = vi.fn();
    render(<ApiErrorFallback error={null} onRetry={onRetry} />);
    const button = screen.getByText("Retry");
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("does not render retry button when onRetry is not provided", () => {
    render(<ApiErrorFallback error={null} />);
    expect(screen.queryByText("Retry")).not.toBeInTheDocument();
  });
});
