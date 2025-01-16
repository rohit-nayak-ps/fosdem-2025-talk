// animation.js

// Create a master timeline. Paused so we can manually control it.
const tl = gsap.timeline({
  defaults: { duration: 1, ease: "power2.inOut" },
  paused: true
});

/**
 * STEP 1: Current System - App <--> RDS
 * - Reveal the App and RDS
 * - Animate the connector line between them
 */
tl.addLabel("step1")
  .to("#app", { autoAlpha: 1, x: 0 }, "step1")
  .to("#rds", { autoAlpha: 1, x: 0 }, "<")
  .to("#connectorAppRDS", { strokeDashoffset: 0 }, "<");

/**
 * STEP 2: Add Vitess Cluster
 * - Reveal Vitess cluster components (vtgate, shards)
 * - Show external keyspace
 */
tl.addLabel("step2")
  // fade in Vitess cluster container or each component individually
  .to("#vitessCluster .component", { autoAlpha: 1, stagger: 0.2 }, "step2");

/**
 * STEP 3: Start MoveTables Workflow
 * - Animate “data pulling” from RDS into Vitess Keyspace (illustrative arrow or highlight)
 * - Show Routing Rules and Denied Tables
 */
tl.addLabel("step3")
  .to("#routingRules", { autoAlpha: 1 }, "step3")
  .to("#deniedTables", { autoAlpha: 1 }, "<")
  // Example “pulsing” effect to show data movement
  .fromTo(
    "#connectorAppRDS",
    { strokeDasharray: "8 8", strokeDashoffset: 0 },
    { strokeDashoffset: 16, repeat: 3, yoyo: true, duration: 0.5 },
    "<"
  );

/**
 * STEP 4: Point App to Vitess
 * - Shift the App’s connection from RDS to vtgate
 * - Possibly hide or de-emphasize the direct RDS connector
 */
tl.addLabel("step4")
  // Example: fade out old connector, fade in a new connector line for App->vtgate
  .to("#connectorAppRDS", { autoAlpha: 0 }, "step4")
  .call(() => {
    // If you have a new line element for App->vtgate, fade it in
    gsap.to("#connectorAppVtgate", { autoAlpha: 1, strokeDashoffset: 0 });
  });

/**
 * STEP 5: Switch Replica Reads
 * - Reads come from Vitess, writes still go to RDS
 * - Update routing rules
 */
tl.addLabel("step5")
  // Possibly highlight or animate routing rules changes
  .to("#routingRules", { scale: 1.1, repeat: 1, yoyo: true, duration: 0.5 }, "step5")
  // Animate connectors or text to visually show read from Vitess, write to RDS
  .call(() => {
    // You can show an arrow or text label: "Replica Reads => Vitess"
    console.log("Switched replica reads to Vitess");
  });

/**
 * STEP 6: Switch Writes
 * - All data to Vitess
 * - Denied Tables on Source
 * - Show Reverse Replication
 */
tl.addLabel("step6")
  .call(() => {
    // Possibly fade out RDS or mark it as secondary
    gsap.to("#rds", { opacity: 0.5 });
  })
  .call(() => {
    // Show or highlight reverse replication arrow back to RDS if needed
    gsap.to("#reverseReplicationArrow", { autoAlpha: 1, strokeDashoffset: 0 });
  }, "<");

/**
 * A helper function to jump to labeled steps in the timeline.
 */
function goToStep(step) {
  tl.tweenTo(`step${step}`);
}

// Expose goToStep to global scope so HTML buttons can access it
window.goToStep = goToStep;

let currentStep = 1;
function nextStep() {
  currentStep++;
  tl.tweenTo(`step${currentStep}`);
}
function prevStep() {
  currentStep--;
  tl.tweenTo(`step${currentStep}`);
}

