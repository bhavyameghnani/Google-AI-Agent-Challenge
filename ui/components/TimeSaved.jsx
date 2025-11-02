import React from "react";
import "./TimeSaved.css";

// Data computed from the attached slides (midpoints used for ranges)
const FEATURES = [
  {
    key: "competitor",
    title: "to research about startup and its competitors",
    minutesSaved: 1005.5,
  },
  {
    key: "founder",
    title:
      "to summarize and enrich founder related info like pitch decks, call transcriptions",
    minutesSaved: 831.5, // computed from image midpoints
  },
  {
    key: "factchecker",
    title: "to do due diligence and fact checking on received pitch decks",
    minutesSaved: 513.25,
  },
  {
    key: "newsletter",
    title: "to gather all data to be updated about market sectors like healthcare tech",
    minutesSaved: 913.5,
  },
];

function minutesToHours(mins) {
  return +(mins / 60).toFixed(0);
}

export default function TimeSaved() {
  const totalMinutes = FEATURES.reduce((s, f) => s + f.minutesSaved, 0);
  const totalHours = minutesToHours(totalMinutes);

  return (
    <section className="ts-card border-2 p-2 rounded-sm">
      <div className="ts-inner">
        <h3 className="ts-title">Time saved with SenseAI</h3>

        <ul className="ts-list">
          {FEATURES.map((f) => (
            <li key={f.key} className="ts-item">
              <mark>
                <span className="ts-plus">
                  +{minutesToHours(f.minutesSaved)} hrs
                </span>
              </mark>
              <span className="ts-text"> {f.title}</span>
            </li>
          ))}
        </ul>

        <div className="ts-total">
          ={" "}
          <mark>
            <span className="ts-total-hours">{totalHours}+</span> hrs
          </mark>{" "}
          of time saved with SenseAI
        </div>
      </div>
    </section>
  );
}
