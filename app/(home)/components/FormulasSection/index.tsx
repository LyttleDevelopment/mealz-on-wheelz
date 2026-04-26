"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Container } from "@lyttle-development/ui";
import { MIN_GUESTS, STARTUP_COST } from "@/_lib/booking/constants";
import { experiences } from "../../data/constants";
import type { Experience } from "../../data/types";
import { SectionHeading } from "../SectionHeading";
import styles from "./index.module.scss";

export function FormulasSection() {
  const detailPanelId = useId();
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const [selectedExperienceId, setSelectedExperienceId] = useState<
    Experience["id"] | null
  >(null);
  const [activeTabLabel, setActiveTabLabel] = useState<string | null>(null);

  const selectedExperience =
    experiences.find((experience) => experience.id === selectedExperienceId) ??
    null;
  const activeTab =
    selectedExperience?.tabs.find((tab) => tab.label === activeTabLabel) ??
    selectedExperience?.tabs[0] ??
    null;

  // Scroll to detail panel on mobile when an experience is selected
  useEffect(() => {
    if (!selectedExperienceId) return;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return;
    setTimeout(() => {
      detailPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  }, [selectedExperienceId]);

  function handleExperienceSelect(experience: Experience) {
    setSelectedExperienceId(experience.id);
    setActiveTabLabel(experience.tabs[0]?.label ?? null);
  }

  return (
    <section id="menu" className={styles.section}>
      <Container>
        <SectionHeading
          title="Onze formules"
          description="Ontdek onze selectie vers bereide gerechten, gemaakt met ingrediënten van topkwaliteit."
        />

        <div className={styles.metaRow}>
          <p className={styles.metaHint}>
            Klik op een experience voor meer info
          </p>
          <p className={styles.metaInfo}>
            Min. {MIN_GUESTS} pers. · €{STARTUP_COST} opstartkost
          </p>
        </div>

        <div className={styles.experienceGrid}>
          {experiences.map((experience) => {
            const isActive = experience.id === selectedExperience?.id;

            return (
              <button
                key={experience.id}
                type="button"
                className={styles.experienceCard}
                data-active={isActive || undefined}
                aria-pressed={isActive}
                aria-expanded={isActive}
                aria-controls={detailPanelId}
                onClick={() => handleExperienceSelect(experience)}
              >
                <span className={styles.cardHeader}>
                  <span className={styles.cardIcon} aria-hidden="true">
                    {experience.icon}
                  </span>
                  <span className={styles.cardTitle}>{experience.title}</span>
                  <span className={styles.cardCategory}>
                    {experience.category}
                  </span>
                </span>

                <span className={styles.cardPrices}>
                  {experience.priceBadges.map((badge) => (
                    <span key={badge} className={styles.pricePill}>
                      {badge}
                    </span>
                  ))}
                </span>

                <span className={styles.cardFooter}>
                  <span className={styles.cardAction}>Bekijk menu →</span>
                </span>
              </button>
            );
          })}
        </div>

        {selectedExperience && activeTab && (
          <div
            id={detailPanelId}
            className={styles.detailPanel}
            ref={detailPanelRef}
          >
            <div className={styles.detailHeader}>
              <h3 className={styles.detailTitle}>{selectedExperience.title}</h3>
              <p className={styles.detailSubtitle}>
                {selectedExperience.detailSubtitle}
              </p>

              <div
                className={styles.detailTabs}
                role="tablist"
                aria-label={`${selectedExperience.title} menu onderdelen`}
              >
                {selectedExperience.tabs.map((tab) => {
                  const isTabActive = tab.label === activeTab.label;

                  return (
                    <button
                      key={tab.label}
                      type="button"
                      role="tab"
                      className={styles.detailTab}
                      data-active={isTabActive || undefined}
                      aria-selected={isTabActive}
                      onClick={() => setActiveTabLabel(tab.label)}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.detailBody}>
              <p className={styles.sectionLabel}>{activeTab.label}</p>

              <div className={styles.menuList}>
                {activeTab.entries.map((entry, index) =>
                  entry.note ? (
                    <p
                      key={`${activeTab.label}-note-${index}`}
                      className={styles.noteRow}
                    >
                      {entry.note}
                    </p>
                  ) : (
                    <div
                      key={`${activeTab.label}-${entry.name}-${index}`}
                      className={styles.menuItem}
                    >
                      <span className={styles.itemName}>{entry.name}</span>
                      <span className={styles.itemPrice}>{entry.price}</span>
                    </div>
                  ),
                )}
              </div>

              <div className={styles.noticeBox}>
                <p className={styles.noticeText}>{selectedExperience.notice}</p>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
