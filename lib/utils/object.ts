namespace ObjectUtils {
  export const isEmptyObject = (obj: object) =>
    obj && obj.constructor === Object && Object.keys(obj).length === 0;
}

export default ObjectUtils;
