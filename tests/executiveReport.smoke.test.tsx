import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { ExecutiveReport } from "../src/pages/ExecutiveReport";

describe("Executive Report Page Smoke Test", () => {
  it("renders report preview and download PDF button successfully", async () => {
    render(<ExecutiveReport />);

    // Check Header & Toolbar
    expect(await screen.findByText(/Executive Credit Assessment Report/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Download PDF/i })).toBeInTheDocument();

    // Check Key Sections
    expect(screen.getByText(/1. Executive Summary/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Key Financial Highlights/i)).toBeInTheDocument();
    expect(screen.getByText(/5. Risk Aggregation & Credit Recommendation/i)).toBeInTheDocument();
    expect(screen.getAllByText(/APPROVE WITH CONDITIONS/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/6. Regulatory & Institutional Disclaimer/i)).toBeInTheDocument();
  });
});
