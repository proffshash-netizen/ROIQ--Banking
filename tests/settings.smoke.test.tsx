import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { Settings } from "../src/pages/Settings";

describe("Settings Page Smoke Test", () => {
  it("renders Settings sections, toggles, about and status successfully", async () => {
    render(<Settings />);

    // Verify Title
    expect(await screen.findByText("System Settings")).toBeInTheDocument();

    // Verify Tab switching & General section by default
    expect(screen.getByText("Preferred Language")).toBeInTheDocument();
    expect(screen.getByText("Auto Save Changes")).toBeInTheDocument();

    // Switch to Appearance Tab
    const appearanceTab = screen.getByRole("button", { name: /Appearance/i });
    fireEvent.click(appearanceTab);
    expect(screen.getByText("Interface Theme")).toBeInTheDocument();
    expect(screen.getByText("Dashboard Density")).toBeInTheDocument();

    // Switch to Notifications Tab
    const notificationsTab = screen.getByRole("button", { name: /Notifications/i });
    fireEvent.click(notificationsTab);
    expect(screen.getByText("Email Alerts")).toBeInTheDocument();
    expect(screen.getByText("Weekly Executive Reports")).toBeInTheDocument();

    // Switch to About Tab
    const aboutTab = screen.getByRole("button", { name: /About ROIQ AI/i });
    fireEvent.click(aboutTab);
    expect(screen.getByText(/ROIQ AI is an intelligent enterprise platform/i)).toBeInTheDocument();
    expect(screen.getByText("Platform Version")).toBeInTheDocument();
  });
});
