let funcIndex = 0
/**
 * 获取唯一的方法名
 */
export function getOnlyShortKeyName(){
    return "_key_" + funcIndex++
}

/**
 * 根据列表获取组件模板字符
 * @param list 列表
 * @param template 组件模板
 */
export function getAllTemplateByList(list: number[], template: string): string{
    if(!template){
        return ""
    }
    if(!Array.isArray(list)){
        throw new Error("需要传入数组")
    }
    // tslint:disable-next-line:typedef
    const result = list.map((value: number) => {
        return template.replace(/_0/g, "_"+value)
    }).join("\n")
    return result
}