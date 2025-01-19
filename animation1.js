// Create a master timeline, paused so we can control it via step buttons.
const tl = gsap.timeline({ defaults: { duration: 0.4 }, paused: true });

// STEP 1: Current System - App <--> RDS
tl.addLabel("step1")
    .to("#app", { autoAlpha: 1, x: 0 }, "step1")
    .to("#rds", { autoAlpha: 1, x: 0 }, "<")
    // Animate the App <-> RDS arrow
    .to("#arrowAppRDS", { autoAlpha: 1, strokeDashoffset: 0 }, "<");

// STEP 2: Add Vitess Cluster
// Show the cluster & External Keyspace arrow from RDS -> External
tl.addLabel("step2")
    .to("#vitessCluster .component", { autoAlpha: 1, stagger: 0.2 }, "step2")
    // Show arrow from RDS to the external keyspace (for example)
    .to("#arrowRDSExternal", { autoAlpha: 1, strokeDashoffset: 0 }, "<");

// STEP 3: Start MoveTables Workflow
// Show data pulling from RDS -> Keyspace, show routing rules & denied tables
tl.addLabel("step3")
    .to("#routingRules", { autoAlpha: 1 }, "step3")
    .to("#deniedTables", { autoAlpha: 1 }, "<")
    // Animate an arrow from RDS -> Keyspace to simulate data pulling
    .to("#arrowRDSKeyspace", { autoAlpha: 1, strokeDashoffset: 0 }, "<")
    // Optional: pulse the arrow to emphasize data flow
    .fromTo(
        "#arrowRDSKeyspace",
        { strokeDasharray: "6 6", strokeDashoffset: 0 },
        { strokeDashoffset: 12, repeat: 3, yoyo: true, duration: 0.5 },
        "<"
    );

// STEP 4: Point App to Vitess (App -> vtgate, route back to RDS under the hood)
tl.addLabel("step4")
    // Hide the old arrow if you like (App <-> RDS)
    .to("#arrowAppRDS", { autoAlpha: 0 }, "step4")
    // Show new arrow from App -> vtgate
    .to("#arrowAppVtgate", { autoAlpha: 1, strokeDashoffset: 0 }, "<");

// STEP 5: Switch Replica Reads (Reads -> Vitess, Writes -> RDS)
// Possibly highlight routing rules changes
tl.addLabel("step5")
    .to("#routingRules", { scale: 1.1, repeat: 1, yoyo: true, duration: 0.5 }, "step5")
    // Show an arrow from vtgate -> Keyspace to represent read traffic
    .to("#arrowVtgateKeyspace", { autoAlpha: 1, strokeDashoffset: 0 }, "<")
    .call(() => {
      console.log("Reads now route to Vitess, writes still go to RDS");
    });

// STEP 6: Switch Writes to Vitess
// Show reverse replication, or highlight that everything is now in Vitess
tl.addLabel("step6")
    .call(() => {
      // Fade out RDS to show it's no longer primary
      gsap.to("#rds", { opacity: 0.4 });
    })
    // Show arrow for reverse replication (Keyspace -> RDS)
    .to("#arrowReverseReplication", { autoAlpha: 1, strokeDashoffset: 0 }, "<")
    .call(() => {
      console.log("All writes go to Vitess; Reverse replication keeps RDS in sync if needed.");
    });

// A helper function to jump to labeled steps in the timeline.
function goToStep(step) {
  tl.tweenTo(`step${step}`);
}

// Expose goToStep to global scope
window.goToStep = goToStep;
