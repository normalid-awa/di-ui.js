import "reflect-metadata"


/**
 * All the metadata keys will use in framework
 * for indentify the inject action
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const MetadataKeys = {
	ResolvedProperty: Symbol("ResolvedProperty"),
	CachedProperty: Symbol("CachedProperty"),
};
