# Architecture comparison exercise

The supplied project already separates console, application-core and infrastructure
types. The long `OrderProcessor.ProcessOrder` method remains deliberately coupled
to multiple responsibilities for the refactoring exercise.

Compare the current implementation with **your own** proposed extraction:

| Aspect | Before evidence | After evidence |
| --- | --- | --- |
| Validation order | Record source path and condition | Same condition/order or approved change |
| Inventory reservation | Record call and returned state | Same effect |
| Payment rejection | Record compensation branch | Reservation still released |
| Audit sequence | Record stable event fields | Same ordering and business data |
| Error result | Record status/message semantics | Preserved semantics |

Folder names and line counts do not prove architectural quality. No “identical
processing time” or pre-executed before/after result is claimed by this document.
