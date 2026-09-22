# Review Custom

Review the supplied repository context for custom implementations and orchestration that duplicate an idiomatic native feature, the standard library, an existing dependency, or a maintained third-party package.

This is a behavior-preserving simplification review. It is not a feature-removal review. Before classifying findings, identify every substantial custom implementation and orchestration, analyze the largest first, and include each. Lack of a complete replacement is not grounds for omission or superficial treatment.

Primary rules:

1. Preserve all existing intended functionality.
   - Do not remove or disable features, optional paths, services, workflows, models, endpoints, side effects, recovery paths, safety checks, or operator entry points.
   - Do not treat an unused, optional, disabled, or currently unconsumed feature as permission to remove it.
   - “Hard required” applies to the behavior that the custom code implements. If that behavior must remain and  
     no complete replacement exists, keep the custom code.

2. Prove replacement parity before recommending a change.  
   For each candidate, trace:
   - all callers and inputs;
   - all outputs and consumers;
   - persistent state and external side effects;
   - identity and idempotency behavior;
   - retry, failure, timeout, and recovery behavior;
   - security and secret handling;
   - deployment and rollback behavior;
   - operator-visible entry points;
   - availability and performance behavior.

3. Name the exact replacement.
   - Identify the native feature, standard-library API, existing dependency, or maintained package.
   - State which exact replacement feature covers each current behavior.
   - Do not assume or invent package capabilities.
   - If complete parity is not established by the supplied context, do not recommend the replacement. Mark it as
     unverified instead.

4. Require a net simplification.  
    A valid replacement must reduce total repository and operational complexity.
   - Count new dependencies, configuration, state, migrations, generated files, and operator procedures.
   - Do not move custom code into another wrapper.
   - Do not replace automated convergence with manual commands.
   - Do not add a large platform to remove a small amount of code.
   - Do not centralize code across separate deployment or repository boundaries unless that is already  
     supported.
   - Do not replace graceful reload, atomic state, or recovery behavior with a simpler but weaker operation.

5. Prefer direct native use.
   - Remove thin adapters only when callers can use the native feature directly with the same inputs, outputs,  
     and side effects.
   - Use native declarative features such as Compose dependencies, YAML extension fields, systemd facilities,  
     database functions, or platform workflow features when they fully cover the contract.
   - Repository-owned declarative configuration is not automatically a hand-rolled implementation.

6. Keep justified custom code.  
    Keep custom code when no complete native or packaged replacement covers its required contract. Do not  
   recommend a speculative rewrite.

For every confirmed candidate, provide:

1. File paths and named functions, nodes, services, or workflow steps.
2. The current behavior contract.
3. The exact native or packaged replacement.
4. A behavior-parity explanation.
5. The custom code that can be deleted.
6. Any migration needed to preserve existing state or identities.
7. The expected net reduction in code and complexity.
8. Confidence: high, medium, or low.

Use this output structure:

A. Confirmed behavior-preserving replacements

- Include only candidates with demonstrated full parity.
- Order them by net value.

B. Unverified possibilities

- State the missing parity evidence.
- Do not recommend implementation yet.

Do not propose feature removal.  
 Do not provide broad architectural rewrites.  
 Do not make edits.  
 Do not run tools.  
 Use only the supplied context.  
 Return only the enumerated review.
