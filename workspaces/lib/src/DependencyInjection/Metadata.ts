import "reflect-metadata"


/**
 * All the metadata keys will use in framework
 * for indentify the inject action
 */
export class MetadataKeys {
	static ResolvedProperty = Symbol("ResolvedProperty");
	static CachedProperty = Symbol("CachedProperty");
}
