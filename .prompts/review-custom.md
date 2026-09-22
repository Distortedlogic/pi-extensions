Identify custom, hand-rolled implementations and orchestration code that provide no benefit over an idiomatic
native feature, the standard library, or an existing third-party package. Replace or remove them. The goal is to
minimize the amount of repository code that consists of custom implementations or orchestration layers where a
cleaner native or packaged solution already exists.

For each candidate:

1. If the platform, standard library, an existing dependency, or some 3rd party package already covers the use case, use it and delete the
    custom code.
2. Do not keep custom wrappers, parsers, scanners, state machines, or orchestration layers that duplicate existing
    functionality.
3. Keep custom code only when it implements behavior that no available native or packaged solution provides that is hard required.
4. if there is custom design that can be altered that allows the code to settle into being reduced n simpler via some non-custom code then it needs to be reduced n simplified.
