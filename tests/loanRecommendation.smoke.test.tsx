import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { Recommendation } from "../src/pages/Recommendation";

describe("Loan Recommendation Page Smoke Test", () => {
  it("renders Credit Decision Engine and Explainability sections successfully", async () => {
    render(<Recommendation />);

    // Check Credit Decision Engine
    expect(await screen.findByText("Credit Decision Engine")).toBeInTheDocument();
    expect(screen.getAllByText("APPROVE WITH CONDITIONS")[0]).toBeInTheDocument();

    // Check Explainability & Decision Support
    expect(screen.getByText("Explainability & Decision Support")).toBeInTheDocument();
    expect(screen.getByText(/Executive Business Justification/i)).toBeInTheDocument();
  });
});
