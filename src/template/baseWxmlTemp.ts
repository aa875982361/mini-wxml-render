/**
 * 生成基础渲染模板
 */

import { AttributeConfig, CustomComponentConfig, CustomComponentSimpleProps, ImportTag } from "../parser-wxml";
import { tagNameKey, contentKey, vdomsKey, childrenKey } from "../global";
import { getAllTemplateByList } from "../utils/util";
import * as path from "path"

// 组件模板最多嵌套14层 超过使用模板组件
// tslint:disable-next-line:typedef
const templateList:number[] = new Array(15).fill(0).map((_v:any, i: any)=> i)

/**
 * 生成基础渲染模板
 * @param baseWxmlPath 基础渲染wxml文件位置
 * @param customComponentConfig 自定义组件的设置
 * @param importWxmlList 导入wxml列表的位置
 * @returns 
 */
export function genBaseWxml(baseWxmlPath: string, customComponentConfig: CustomComponentConfig, importWxmlList: ImportTag[]): string {
    console.log("customComponentConfig", customComponentConfig);
    console.log("importWxmlList", importWxmlList);

    const customComponentTemplateStr = getCustomComponentStrByConfig(customComponentConfig)
    
    return `
        ${genImportListCode(importWxmlList, baseWxmlPath)}
        ${wxsStr}
        ${getAllTemplateByList(templateList, baseComponentTempalte)}
        ${getAllTemplateByList(templateList, customComponentTemplateStr)}
    `
}


const wxsStr = `
<wxs module="utils">
module.exports = {
  getTagName: function(item, cid){
    if(!item.${tagNameKey} && typeof item.${contentKey} === "undefined"){
      return "tmpl_"+cid+"_"+"null"
    }
    var tag = item.${tagNameKey} || "text-node";
    var result = "tmpl_"+cid+"_"+tag;
    return result
  },
  getTemplateByCid: function(cid){
    return "container_" + cid
  },
  getValue: function(value, defaultValue, isObj){
    if(typeof value === "undefined"){
      return isObj ? {} : defaultValue
    }
    return value
  },
  isFocus: function(item, prefix) {
    var s = item.focus !== undefined ? 'focus' : 'blur'
    return prefix + item.${tagNameKey} + '_' + s
  },
}
</wxs>
`

/**
 * 基础组件的渲染模板
 */
const baseComponentTempalte = `
<template name="container_0"><block wx:for="{{${vdomsKey}}}" wx:key="key"><template is="{{utils.getTagName(item, cid)}}" data="{{item: item, cid}}"></template></block></template>

<template name="tmpl_0_view">
  <view wx:key="{{item.key}}" data-data="{{item.dataSet}}" hover-class="{{utils.getValue(item.hoverClass,'none')}}" hover-stop-propagation="{{utils.getValue(item.hoverStopPropagation,false)}}" hover-start-time="{{utils.getValue(item.hoverStartTime,50)}}" hover-stay-time="{{utils.getValue(item.hoverStayTime,400)}}" animation="{{item.animation}}" bindtouchstart="eventHandler" bindtouchmove="eventHandler" bindtouchend="eventHandler" bindtouchcancel="eventHandler" bindlongpress="eventHandler" bindanimationstart="eventHandler" bindanimationiteration="eventHandler" bindanimationend="eventHandler" bindtransitionend="eventHandler" style="{{item.style}}" class="{{item.class}}" bindtap="eventHandler"  id="{{item.uid}}">
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}:item.${childrenKey},cid: cid+1}}" />
  </view>
</template>

<template name="tmpl_0_pure-view">
  <view wx:key="{{item.key}}" style="{{item.style}}" class="{{item.class}}">
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}:item.${childrenKey},cid: cid+1}}" />
  </view>
</template>

<template name="tmpl_0_static-view">
  <view wx:key="{{item.key}}" hover-class="{{utils.getValue(item.hoverClass,'none')}}" hover-stop-propagation="{{utils.getValue(item.hoverStopPropagation,false)}}" hover-start-time="{{utils.getValue(item.hoverStartTime,50)}}" hover-stay-time="{{utils.getValue(item.hoverStayTime,400)}}" animation="{{item.animation}}"  style="{{item.style}}" class="{{item.class}}" id="{{item.uid}}">
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}:item.${childrenKey},cid: cid+1}}" />
  </view>
</template>


<template name="tmpl_0_text">
  <text wx:key="{{item.key}}" data-data="{{item.dataSet}}" style="{{item.style}}" class="{{item.class}}" bindtap="eventHandler"  id="{{item.uid}}"><template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}:item.${childrenKey},cid: cid+1}}" /></text>
</template>

<template name="tmpl_0_template">
  <template is="{{item.is}}" data="{{...item.data}}">
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </template>
</template>

<template name="tmpl_0_button">
  <button wx:key="{{item.key}}" data-data="{{item.dataSet}}" size="{{utils.getValue(item.size,'default')}}" type="{{item.type}}" plain="{{utils.getValue(item.plain,false)}}" disabled="{{item.disabled}}" loading="{{utils.getValue(item.loading,false)}}" form-type="{{item.formType}}" open-type="{{item.openType}}" hover-class="{{utils.getValue(item.hoverClass,'button-hover')}}" hover-stop-propagation="{{utils.getValue(item.hoverStopPropagation,false)}}" hover-start-time="{{utils.getValue(item.hoverStartTime,20)}}" hover-stay-time="{{utils.getValue(item.hoverStayTime,70)}}" name="{{item.name}}" lang="{{utils.getValue(item.lang,en)}}" session-from="{{item.sessionFrom}}" send-message-title="{{item.sendMessageTitle}}" send-message-path="{{item.sendMessagePath}}" send-message-img="{{item.sendMessageImg}}" app-parameter="{{item.appParameter}}" show-message-card="{{utils.getValue(item.showMessageCard,false)}}" business-id="{{item.businessId}}" bindgetuserinfo="eventHandler" bindcontact="eventHandler" bindgetphonenumber="eventHandler" binderror="eventHandler" bindopensetting="eventHandler" bindlaunchapp="eventHandler" style="{{item.style}}" class="{{item.class}}" bindtap="eventHandler"  id="{{item.uid}}">
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </button>
</template>

<template name="tmpl_0_input">
  <template is="{{utils.isFocus(item, 'tmpl_0_')}}" data="{{item:item}}" />
</template>

<template name="tmpl_0_input_focus">
  <input wx:key="{{item.key}}" data-data="{{item.dataSet}}" value="{{item.value}}" type="{{utils.getValue(item.type,'')}}" password="{{utils.getValue(item.password,false)}}" placeholder="{{item.placeholder}}" placeholder-style="{{item.placeholderStyle}}" placeholder-class="{{utils.getValue(item.placeholderClass,'input-placeholder')}}" disabled="{{item.disabled}}" maxlength="{{utils.getValue(item.maxlength,140)}}" cursor-spacing="{{utils.getValue(item.cursorSpacing,0)}}" focus="{{utils.getValue(item.focus,false)}}" confirm-type="{{utils.getValue(item.confirmType,'done')}}" confirm-hold="{{utils.getValue(item.confirmHold,false)}}" cursor="{{utils.getValue(item.cursor,item.value.length)}}" selection-start="{{utils.getValue(item.selectionStart,-1)}}" selection-end="{{utils.getValue(item.selectionEnd,-1)}}" bindinput="eventHandler" bindfocus="eventHandler" bindblur="eventHandler" bindconfirm="eventHandler" name="{{item.name}}" auto-focus="{{utils.getValue(item.autoFocus,false)}}" always-embed="{{utils.getValue(item.alwaysEmbed,false)}}" adjust-position="{{utils.getValue(item.adjustPosition,true)}}" hold-keyboard="{{utils.getValue(item.holdKeyboard,false)}}" bindkeyboardheightchange="eventHandler" style="{{item.style}}" class="{{item.class}}" bindtap="eventHandler"  id="{{item.uid}}" />
</template>

<template name="tmpl_0_input_blur">
  <input wx:key="{{item.key}}" data-data="{{item.dataSet}}" value="{{item.value}}" type="{{utils.getValue(item.type,'')}}" password="{{utils.getValue(item.password,false)}}" placeholder="{{item.placeholder}}" placeholder-style="{{item.placeholderStyle}}" placeholder-class="{{utils.getValue(item.placeholderClass,'input-placeholder')}}" disabled="{{item.disabled}}" maxlength="{{utils.getValue(item.maxlength,140)}}" cursor-spacing="{{utils.getValue(item.cursorSpacing,0)}}" confirm-type="{{utils.getValue(item.confirmType,'done')}}" confirm-hold="{{utils.getValue(item.confirmHold,false)}}" cursor="{{utils.getValue(item.cursor,item.value.length)}}" selection-start="{{utils.getValue(item.selectionStart,-1)}}" selection-end="{{utils.getValue(item.selectionEnd,-1)}}" bindinput="eventHandler" bindfocus="eventHandler" bindblur="eventHandler" bindconfirm="eventHandler" name="{{item.name}}" auto-focus="{{utils.getValue(item.autoFocus,false)}}" always-embed="{{utils.getValue(item.alwaysEmbed,false)}}" adjust-position="{{utils.getValue(item.adjustPosition,true)}}" hold-keyboard="{{utils.getValue(item.holdKeyboard,false)}}" bindkeyboardheightchange="eventHandler" style="{{item.style}}" class="{{item.class}}" bindtap="eventHandler"  id="{{item.uid}}" />
</template>

<template name="tmpl_0_text-node"> {{item.${contentKey}}} </template>

<template name="tmpl_0_navbar">
  <navbar id="{{item.uid}}" title="{{item.title}}" noPlaceholder="{{item.noPlaceholder}}" css="{{item.css}}"></navbar>
</template>

<template name="tmpl_0_keyboard">
  <keyboard id="{{item.uid}}" limit="{{item.limit}}" price="{{item.price}}" bind:change="eventHandler" bind:confirm="eventHandler"></keyboard>
</template>

<template name="tmpl_0_scroll-view">
  <scroll-view wx:key="{{item.key}}" data-data="{{item.dataSet}}" scroll-x="{{utils.getValue(item.scrollX,false)}}" scroll-y="{{utils.getValue(item.scrollY,false)}}" upper-threshold="{{utils.getValue(item.upperThreshold,50)}}" lower-threshold="{{utils.getValue(item.lowerThreshold,50)}}" scroll-top="{{item.scrollTop}}" scroll-left="{{item.scrollLeft}}" scroll-into-view="{{item.scrollIntoView}}" scroll-with-animation="{{utils.getValue(item.scrollWithAnimation,false)}}" enable-back-to-top="{{utils.getValue(item.enableBackToTop,false)}}" bindscrolltoupper="eventHandler" bindscrolltolower="eventHandler" bindscroll="eventHandler" bindtouchstart="eventHandler" bindtouchmove="eventHandler" bindtouchend="eventHandler" bindtouchcancel="eventHandler" bindlongpress="eventHandler" bindanimationstart="eventHandler" bindanimationiteration="eventHandler" bindanimationend="eventHandler" bindtransitionend="eventHandler" enable-flex="{{utils.getValue(item.enableFlex,false)}}" scroll-anchoring="{{utils.getValue(item.scrollAnchoring,false)}}" refresher-enabled="{{utils.getValue(item.refresherEnabled,false)}}" refresher-threshold="{{utils.getValue(item.refresherThreshold,45)}}" refresher-default-style="{{utils.getValue(item.refresherDefaultStyle,'black')}}" refresher-background="{{utils.getValue(item.refresherBackground,'#FFF')}}" refresher-triggered="{{utils.getValue(item.refresherTriggered,false)}}" enhanced="{{utils.getValue(item.enhanced,false)}}" bounces="{{utils.getValue(item.bounces,true)}}" show-scrollbar="{{utils.getValue(item.showScrollbar,true)}}" paging-enabled="{{utils.getValue(item.pagingEnabled,false)}}" fast-deceleration="{{utils.getValue(item.fastDeceleration,false)}}" binddragstart="eventHandler" binddragging="eventHandler" binddragend="eventHandler" bindrefresherpulling="eventHandler" bindrefresherrefresh="eventHandler" bindrefresherrestore="eventHandler" bindrefresherabort="eventHandler" style="{{item.style}}" class="{{item.class}}" bindtap="eventHandler"  id="{{item.uid}}">
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </scroll-view>
</template>

<template name="tmpl_0_block">
  <block wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}">
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </block>
</template>

<template name="tmpl_0_null">
</template>

<template name="tmpl_0_image">
  <image wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}" src="{{item.src}}" mode="{{utils.getValue(item.mode,'scaleToFill')}}" lazy-load="{{utils.getValue(item.lazyLoad,false)}}" binderror="eventHandler" bindload="eventHandler" bindtouchstart="eventHandler" bindtouchmove="eventHandler" bindtouchend="eventHandler" bindtouchcancel="eventHandler" bindlongpress="eventHandler" webp="{{utils.getValue(item.webp,false)}}" show-menu-by-longpress="{{utils.getValue(item.showMenuByLongpress,false)}}" style="{{item.style}}" class="{{item.class}}" bindtap="eventHandler"  id="{{item.uid}}">
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </image>
</template>

<template name="tmpl_0_icon">
  <icon wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}" style="{{item.style}}" class="{{item.class}}" size="{{utils.getValue(item.size, 23)}}" type="{{item.type}}" color="{{utils.getValue(item.color, '')}}" bind:tap="eventHandler"/>
</template>

<template name="tmpl_0_i">
  <i 
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}" 
    style="{{item.style}}" class="{{item.class}}" 
    bindtouchstart="eventHandler"
    bindtouchmove="eventHandler"
    bindtouchcancel="eventHandler"
    bindtouchend="eventHandler"
    bindtap="eventHandler"
    bindlongpress="eventHandler"
    bindlongtap="eventHandler"
    bindtransitionend="eventHandler"
    bindanimationstart="eventHandler"
    bindanimationiteration="eventHandler"
    bindanimationend="eventHandler"
    bindtouchforcechange="eventHandler"
  />
</template>

<template name="tmpl_0_progress">
  <progress wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}" style="{{item.style}}" class="{{item.class}}" percent="{{utils.getValue(item.percent, 0)}}" color="{{utils.getValue(item.color, '#09BB07')}}" activeColor="{{utils.getValue(item.activeColor, '#09BB07')}}" backgroundColor="{{utils.getValue(item.backgroundColor, '#EBEBEB')}}" active="{{utils.getValue(item.active, false)}}" active-mode="{{utils.getValue(item.activeMode, backwards)}}"  show-info="{{utils.getValue(item.showInfo, false)}}" stroke-width="{{utils.getValue(item.strokeWidth, 6)}}" border-radius="{{util.getValue(item.borderRadius, 0)}}" font-size="{{utils.getValue(item.fontSize, 16)}}" duration="{{utils.getValue(item.duration, 30)}}" bindactiveend="eventHandler"/>
</template>

<template name="tmpl_0_rich-text">
  <rich-text wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}" style="{{item.style}}" class="{{item.class}}" nodes="{{utils.getValue(item.nodes, [])}}" space="{{util.getVaue(item.space, 'ensp')}}" ></rich-text>
</template>

<template name="tmpl_0_swiper">
  <swiper
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"  
    indicator-dots="{{utils.getValue(item.indicatorDots, false)}}"
    indicator-color="{{utils.getValue(item.indicatorcolor, 'rgba(0, 0, 0, .3)')}}"
    indicator-active-color="{{utils.getValue(item.indicatorActiveColor, '#000000')}}"
    autoplay="{{utils.getValue(item.autoplay, false)}}" 
    interval="{{utils.getValue(item.interval, 5000)}}" 
    duration="{{utils.getValue(item.duration, 500)}}"
    circular="{{utils.getValue(item.circular, false)}}" 
    vertical="{{utils.getValue(item.vertical, false)}}" 
    previous-margin="{{utils.getValue(item.previousMargin, '0px')}}" 
    next-margin="{{utils.getValue(item.nextMargin, '0px')}}" 
    snap-to-edge="{{utils.getValue(item.snapToEdge, false)}}" 
    display-multiple-items="{{utils.getValue(item.displayMultipleItems, 1)}}" 
    easing-function="{{utils.getValue(item.easingFunction, 'default')}}" 
    bindchange="eventHandler"
    bindtransition="eventHandler"
    bindanimationfinish="eventHandler"
  >
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </swiper>
</template>

<template name="tmpl_0_swiper-item">
  <swiper-item wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}" style="{{item.style}}" class="{{item.class}}"  item-id="{{utils.getValue(item.itemId, '')}}" skip-hidden-item-layout="{{utils.getValue(item.skipHiddenItemLayout, '')}}">
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </swiper-item>
</template>

<template name="tmpl_0_switch">
  <switch wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}" style="{{item.style}}" class="{{item.class}}"  checked="{{utils.getValue(item.checked, false)}}" disabled="{{utils.getValue(item.disabled, false)}}" type="{{utils.getValue(item.type, 'switch')}}" color="{{utils.getValue(item.color, '#04BE02')}}" bindchange="eventHandler"/>
</template>

<template name="tmpl_0_movable-area">
  <movable-area 
    style="{{item.style}}" class="{{item.class}}" 
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}" 
    scale-area="{{utils.getValue(item.scaleArea, false)}}" 
  >
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </movable-area>
</template>

<template name="tmpl_0_movable-view">
  <movable-view 
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}" 
    direction="{{utils.getValue(item.direction, 'none')}}"
    inertia="{{utils.getValue(item.inertia, false)}}"
    out-of-bounds="{{utils.getValue(item.outOfBounds, false)}}"
    x="{{utils.getValue(item.x, '0')}}"
    y="{{utils.getValue(item.y, '0')}}"
    damping="{{utils.getValue(item.damping, 20)}}"
    friction="{{utils.getValue(item.friction, 2)}}"
    disabled="{{utils.getValue(item.disabled, false)}}"
    scale="{{utils.getValue(item.scale, false)}}"
    scale-min="{{utils.getValue(item.scaleMin, 0.5)}}"
    scale-max="{{utils.getValue(item.scaleMax, 10)}}"
    scale-value="{{utils.getValue(item.scaleValue, 1)}}"
    animation="{{utils.getValue(item.animation, false)}}"
    width="{{utils.getValue(item.width, '10px')}}"
    height="{{utils.getValue(item.height, '10px')}}"
    bindchange="eventHandler"
    bindscale="eventHandler"
    bindhtouchmove="eventHandler"
    bindvtouchmove="eventHandler"
  >
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </movable-view>
</template>

<template name="tmpl_0_map">
  <map
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
    longitude="{{item.longitude}}"
    latitude="{{item.latitude}}"scale
    scale="{{utils.getValue(item.scale, 16)}}"
    min-scale="{{utils.getValue(item.minScale, 3)}}"
    max-scale="{{utils.getValue(item.maxScale, 20)}}"
    markers="{{utils.getValue(item.markers, [])}}"
    covers="{{utils.getValue(item.covers, [])}}"
    polyline="{{utils.getValue(item.polyline, [])}}"
    circles="{{utils.getValue(item.circles, [])}}"
    controls="{{utils.getValue(item.controls, [])}}"
    include-points="{{utils.getValue(item.includePoints, [])}}"
    show-location="{{utils.getValue(item.showLocation, false)}}"
    polygons="{{utils.getValue(item.polygons, [])}}"
    subkey="{{utils.getValue(item.subkey, '')}}"
    setting="{{utils.getValue(item.setting, '', true)}}"
    layer-style="{{utils.getValue(item.layerStyle, 1)}}"
    rotate="0utils.getValue(item.rotate, 0)}}"
    enable-3D="{{utils.getValue(item.enable3D, false)}}"
    show-compass="{{utils.getValue(item.showCompass, false)}}"
    show-scale="{{utils.getValue(item.showScale, false)}}"
    enable-overlooking="{{utils.getValue(item.enableOverlooking, false)}}"
    enable-zoom="{{utils.getValue(item.enableZoom, true)}}"
    enable-scroll="{{utils.getValue(item.scale, true)}}"
    enable-rotate="{{utils.getValue(item.enableRotate, false)}}"
    enable-satellite="{{utils.getValue(item.enableSatellite, false)}}"
    enable-traffic="{{utils.getValue(item.enableTraffic, false)}}"
    enable-poi="{{utils.getValue(item.enablePoi, true)}}"
    enable-building="{{utils.getValue(item.enableBuilding, false)}}"
    bindtap="eventHandler"
    bindmarkertap="eventHandler"
    bindlabeltap="eventHandler"
    bindcontroltap="eventHandler"
    bindcallouttap="eventHandler"
    bindregionchange="eventHandler"
    bindpoitap="eventHandler"
    bindanchorpointtap="eventHandler"
  >
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{vdoms: item.children, cid: cid+1}}"></template>
  </map>
</template>

<template name="tmpl_0_cover-view">
    <cover-view
      wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
      style="{{item.style}}" class="{{item.class}}"
      hover-class="{{utils.getValue(item.hoverClass,'none')}}"
      hover-stop-propagation="{{utils.getValue(item.hoverStopPropagation,false)}}"
      hover-start-time="{{utils.getValue(item.hoverStartTime,50)}}"
      hover-stay-time="{{utils.getValue(item.hoverStayTime,400)}}"
      animation="{{item.animation}}"
      bindtouchstart="eventHandler"
      bindtouchmove="eventHandler"
      bindtouchend="eventHandler"
      bindtouchcancel="eventHandler"
      bindlongpress="eventHandler"
      bindanimationstart="eventHandler"
      bindanimationiteration="eventHandler"
      bindanimationend="eventHandler"
      bindtransitionend="eventHandler"
      bindtap="eventHandler"
     >
      <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
    </cover-view>
</template>

<template name="tmpl_0_label">
  <label
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
    for="{{utils.getValue(item.for, '')}}"
  >
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </label>
</template>

<template name="tmpl_0_checkbox">
  <checkbox
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
    value="{{utils.getValue(item.value, '')}}"
    disabled="{{utils.getValue(item.disabled, false)}}"
    checked	="{{utils.getValue(item.checked	, false)}}"
    color="{{utils.getValue(item.color, '#09BB07')}}"
  >
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </checkbox>
</template>

<template name="tmpl_0_checkbox-group">
  <checkbox-group
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
    bindchange="eventHandler"
  >
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </checkbox-group>
</template>

<template name="tmpl_0_form">
  <form
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
    report-submit="{{utils.getValue(item.reportSubmit, false)}}"
    report-submit-timeout="{{utils.getValue(item.reportSubmitTimeout, 0)}}"
    bindsubmit="eventHandler"
    bindreset="eventHandler"
  >
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </form>
</template>

<template name="tmpl_0_radio">
  <radio
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
    value="{{utils.getValue(item.value, '')}}"
    disabled="{{utils.getValue(item.disabled, false)}}"
    checked	="{{utils.getValue(item.checked	, false)}}"
    color="{{utils.getValue(item.color, '#09BB07')}}"
  >
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </radio>
</template>

<template name="tmpl_0_radio-group">
  <radio-group
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
    bindchange="eventHandler"
  >
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </radio-group>
</template>

<template name="tmpl_0_picker">
  <picker
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
    header-text="{{utils.getValue(item.header-text, '')}}"
    mode="{{utils.getValue(item.mode, 'selector')}}"
    disabled="{{utils.getValue(item.disabled, false)}}"
    range="{{utils.getValue(item.range, [])}}"
    range-key="{{utils.getValue(item.rangeKey, '')}}"
    value="{{utils.getValue(item.value, 0)}}"
    start="{{utils.getValue(item.start, '')}}"
    end="{{utils.getValue(item.end, '')}}"
    fields="{{utils.getValue(item.fields, 'day')}}"
    custom-item="{{utils.getValue(item.customItem, '')}}"
    bindchange="eventHandler"
    bindcancel="eventHandler"
    bindcolumnchange="eventHandler"
  >
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </picker>
</template>

<template name="tmpl_0_picker-view">
  <picker-view
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
    value="{{utils.getValue(item.value, [])}}"
    indicator-style="{{utils.getValue(item.indicatorStyle, '')}}"
    indicator-class="{{utils.getValue(item.indicatorClass, '')}}"
    mask-style="{{utils.getValue(item.maskStyle, '')}}"
    mask-class="{{utils.getValue(item.maskClass, '')}}"
    bindchange="eventHandler"
    bindpickstart="eventHandler"
    bindpickend="eventHandler"
  >
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </picker-view>
</template>

<template name="tmpl_0_picker-view-column">
  <picker-view-column
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
  >
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </picker-view-column>
</template>

<template name="tmpl_0_slider">
  <slider
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
    min="{{utils.getValue(item.min, 0)}}"
    max="{{utils.getValue(item.max, 100)}}"
    step="{{utils.getValue(item.step, 1)}}"
    disabled="{{utils.getValue(item.disabled, false)}}"
    value="{{utils.getValue(item.value, 0)}}"
    color="{{utils.getValue(item.color, '#e9e9e9')}}"
    selected-color="{{utils.getValue(item.selectedColor, '#1aad19')}}"
    activeColor="{{utils.getValue(item.activeColor, '#1aad19')}}"
    backgroundColor="{{utils.getValue(item.backgroundColor, '#e9e9e9')}}"
    block-size="{{utils.getValue(item.blockSize, 28)}}"
    block-color="{{utils.getValue(item.blockColor, '#ffffff')}}"
    show-value="{{utils.getValue(item.showValue, false)}}"
    bindchanging="eventHandler"
    bindchange="eventHandler"
  >
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </slider>
</template>

<template name="tmpl_0_textarea">
  <textarea
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
    value="{{utils.getValue(item.value, '')}}"
    placeholder="{{utils.getValue(item.placeholder, '')}}"
    placeholder-style="{{utils.getValue(item.placeholderStyle, '')}}"
    placeholder-class="{{utils.getValue(item.placeholderClass, 'textarea-placeholder')}}"
    disabled="{{utils.getValue(item.disabled, false)}}"
    maxlength="{{utils.getValue(item.maxlength, 140)}}"
    auto-focus="{{utils.getValue(item.autoFocus, false)}}"
    focus="{{utils.getValue(item.focus, false)}}"
    auto-height="{{utils.getValue(item.autoHeight, false)}}"
    fixed="{{utils.getValue(item.fixed, false)}}"
    cursor-spacing="{{utils.getValue(item.cursorSpacing, 0)}}"
    cursor="{{utils.getValue(item.cursor, -1)}}"
    show-confirm-bar="{{utils.getValue(item.showConfirmBar, true)}}"
    selection-start="{{utils.getValue(item.selectionStart, -1)}}"
    selection-end="{{utils.getValue(item.selectionEnd, -1)}}"
    adjust-position="{{utils.getValue(item.adjustPosition, true)}}"
    hold-keyboard="{{utils.getValue(item.holdKeyboard, false)}}"
    disable-default-padding="{{utils.getValue(item.disableDefaultPadding, false)}}"
    confirm-type="{{utils.getValue(item.confirmType, 'return')}}"
    confirm-hold="{{utils.getValue(item.confirmHold, false)}}"
    bindfocus="eventHandler"
    bindblur="eventHandler"
    bindlinechange="eventHandler"
    bindinput="eventHandler"
    bindconfirm="eventHandler"
    bindkeyboardheightchange="eventHandler"
  >
  
  </textarea>
</template>

<template name="tmpl_0_editor">
  <editor
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
    read-only="{{utils.getValue(item.readOnly, false)}}"
    placeholder="{{utils.getValue(item.placeholder, '')}}"
    show-img-size="{{utils.getValue(item.showImgSize, false)}}"
    show-img-toolbar="{{utils.getValue(item.showImgToolbar, false)}}"
    show-img-resize="{{utils.getValue(item.showImgResize, false)}}"
    bindready="eventHandler"
    bindfocus="eventHandler"
    bindblur="eventHandler"
    bindinput="eventHandler"
    bindstatuschange="eventHandler"
  >
  
  </editor>
</template>

<template name="tmpl_0_navigator">
  <navigator
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
    target="{{utils.getValue(item.target, 'self')}}"
    url="{{utils.getValue(item.url, '')}}"
    open-type="{{utils.getValue(item.openType, 'navigate')}}"
    delta="{{utils.getValue(item.delta, 1)}}"
    app-id="{{utils.getValue(item.appId, '')}}"
    path="{{utils.getValue(item.path, '')}}"
    extra-data="{{utils.getValue(item.extraData, '', true)}}"
    version="{{utils.getValue(item.version, 'release')}}"
    redirect="{{utils.getValue(item.redirect, false)}}"
    short-link="{{utils.getValue(item.shortLink, '')}}"
    hover-class="{{utils.getValue(item.hoverClass, 'navigator-hover')}}"
    hover-stop-propagation="{{utils.getValue(item.hoverStopPropagation, false)}}"
    hover-start-time="{{utils.getValue(item.hoverStartTime, 50)}}"
    hover-stay-time="{{utils.getValue(item.hoverStayTime, 600)}}"
    bindsuccess="eventHandler"
    bindfail="eventHandler"
    bindcomplete="eventHandler"
  >
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </navigator>
</template>

<template name="tmpl_0_video">
  <video
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
    src="{{item.src}}"
    duration="{{utils.getValue(item.duration, 0)}}"
    controls="{{utils.getValue(item.controls, true)}}"
    danmu-list="{{utils.getValue(item.danmuList, [])}}"
    danmu-btn="{{utils.getValue(item.danmuBtn, false)}}"
    enable-danmu="{{utils.getValue(item.enableDanmu, false)}}"
    autoplay="{{utils.getValue(item.autoplay, false)}}"
    loop="{{utils.getValue(item.loop, false)}}"
    muted="{{utils.getValue(item.muted, false)}}"
    initial-time="{{utils.getValue(item.initialTime, 0)}}"
    page-gesture="{{utils.getValue(item.pageGesture, false)}}"
    direction="{{utils.getValue(item.direction, 0)}}"
    show-progress="{{utils.getValue(item.showProgress, true)}}"
    show-fullscreen-btn="{{utils.getValue(item.showFullscreenBtn, true)}}"
    show-play-btn="{{utils.getValue(item.showPlayBtn, true)}}"
    show-center-play-btn="{{utils.getValue(item.showCenterPlayBtn, true)}}"
    enable-progress-gesture="{{utils.getValue(item.enableProgressGesture, true)}}"
    object-fit="{{utils.getValue(item.objectFit, 'contain')}}"
    poster="{{utils.getValue(item.poster, '')}}"
    show-mute-btn="{{utils.getValue(item.showMuteBtn, false)}}"
    title="{{utils.getValue(item.title, '')}}"
    play-btn-position="{{utils.getValue(item.playBtnPosition, 'bottom')}}"
    enable-play-gesture="{{utils.getValue(item.enablePlayGesture, false)}}"
    auto-pause-if-navigate="{{utils.getValue(item.autoPauseIfNavigate, true)}}"
    auto-pause-if-open-native="{{utils.getValue(item.autoPauseIfOpenNative, true)}}"
    vslide-gesture="{{utils.getValue(item.vslideGesture, false)}}"
    vslide-gesture-in-fullscreen="{{utils.getValue(item.vslideGestureInFullscreen, true)}}"
    ad-unit-id="{{item.adUnitId}}"
    poster-for-crawler="{{item.posterForCrawler}}"
    show-casting-button="{{utils.getValue(item.showCastingButton, false)}}"
    picture-in-picture-mode="{{utils.getValue(item.pictureInPictureMode, '')}}"
    picture-in-picture-show-progress="{{utils.getValue(item.pictureInPictureShowProgress, false)}}"
    enable-auto-rotation="{{utils.getValue(item.enableAutoRotation, false)}}"
    show-screen-lock-button="{{utils.getValue(item.showScreenLockButton, false)}}"
    show-snapshot-button="{{utils.getValue(item.showSnapshotButton, false)}}"
    show-background-playback-button="{{utils.getValue(item.showBackgroundPlaybackButton, false)}}"
    background-poster="{{utils.getValue(item.backgroundPoster, '')}}"
    referrer-policy="{{utils.getValue(item.referrerPolicy, 'no-referrer')}}"
    is-drm="{{utils.getValue(item.isDrm, false)}}"
    provision-url="{{utils.getValue(item.provisionUrl, '')}}"
    certificate-url="{{utils.getValue(item.certificateUrl, '')}}"
    license-url="{{utils.getValue(item.licenseUrl, '')}}"
    bindplay="eventHandler"
    bindpause="eventHandler"
    bindended="eventHandler"
    bindtimeupdate="eventHandler"
    bindfullscreenchange="eventHandler"
    bindwaiting="eventHandler"
    binderror="eventHandler"
    bindprogress="eventHandler"
    bindloadedmetadata="eventHandler"
    bindcontrolstoggle="eventHandler"
    bindenterpictureinpicture="eventHandler"
    bindleavepictureinpicture="eventHandler"
    bindseekcomplete="eventHandler"
  >
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </video>
</template>

<template name="tmpl_0_camera">
  <camera
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
    mode="{{utils.getValue(item.mode, 'normal')}}"
    resolution="{{utils.getValue(item.resolution, 'medium')}}"
    device-position="{{utils.getValue(item.devicePosition, 'back')}}"
    flash="{{utils.getValue(item.flash, 'auto')}}"
    frame-size="{{utils.getValue(item.frameSize, 'medium')}}"
    bindstop="eventHandler"
    binderror="eventHandler"
    bindinitdone="eventHandler"
    bindscancode="eventHandler"
  >
    
  </camera>
</template>

<template name="tmpl_0_live-player">
  <live-player
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
    src="{{utils.getValue(item.src, '')}}"
    mode="{{utils.getValue(item.mode, 'live')}}"
    autoplay="{{utils.getValue(item.autoplay, false)}}"
    muted="{{utils.getValue(item.muted, false)}}"
    orientation="{{utils.getValue(item.orientation, 'vertical')}}"
    object-fit="{{utils.getValue(item.objectFit, 'contain')}}"
    background-mute="{{utils.getValue(item.backgroundMute, false)}}"
    min-cache="{{utils.getValue(item.minCache, 1)}}"
    max-cache="{{utils.getValue(item.maxCache, 3)}}"
    sound-mode="{{utils.getValue(item.soundMode, 'speaker')}}"
    auto-pause-if-navigate="{{utils.getValue(item.autoPauseIfNavigate, true)}}"
    auto-pause-if-open-native="{{utils.getValue(item.autoPauseIfOpenNative, true)}}"
    picture-in-picture-mode="{{utils.getValue(item.pictureInPictureMode, '')}}"
    referrer-policy="{{utils.getValue(item.referrerPolicy, 'no-referrer')}}"
    bindstatechange="eventHandler"
    bindfullscreenchange="eventHandler"
    bindnetstatus="eventHandler"
    bindaudiovolumenotify="eventHandler"
    bindenterpictureinpicture="eventHandler"
    bindleavepictureinpicture="eventHandler"
  >
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </live-player>
</template>

<template name="tmpl_0_live-pusher">
  <live-pusher
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
    url="{{utils.getValue(item.url, '')}}"
    mode="{{utils.getValue(item.mode, 'RTC')}}"
    autopush="{{utils.getValue(item.autopush, false)}}"
    muted="{{utils.getValue(item.muted, false)}}"
    enable-camera="{{utils.getValue(item.enableCamera, true)}}"
    auto-focus="{{utils.getValue(item.autoFocus, true)}}"
    orientation="{{utils.getValue(item.orientation, 'vertical')}}"
    beauty="{{utils.getValue(item.beauty, 0)}}"
    whiteness="{{utils.getValue(item.whiteness, 0)}}"
    aspect="{{utils.getValue(item.aspect, '9:16')}}"
    min-bitrate="{{utils.getValue(item.minBitrate, 200)}}"
    max-bitrate="{{utils.getValue(item.maxBitrate, 1000)}}"
    audio-quality="{{utils.getValue(item.audioQuality, 'high')}}"
    waiting-image="{{utils.getValue(item.waitingImage, '')}}"
    waiting-image-hash="{{utils.getValue(item.waitingImageHash, '')}}"
    zoom="{{utils.getValue(item.zoom, false)}}"
    device-position="{{utils.getValue(item.devicePosition, 'front')}}"
    background-mute="{{utils.getValue(item.backgroundMute, false)}}"
    mirror="{{utils.getValue(item.mirror, false)}}"
    remote-mirror="{{utils.getValue(item.remoteMirror, false)}}"
    local-mirror="{{utils.getValue(item.localMirror, 'auto')}}"
    audio-reverb-type="{{utils.getValue(item.audioReverbType, 0)}}"
    enable-mic="{{utils.getValue(item.enableMic, true)}}"
    enable-agc="{{utils.getValue(item.enableAgc, false)}}"
    enable-ans="{{utils.getValue(item.enableAns, false)}}"
    audio-volume-type="{{utils.getValue(item.audioVolumeType, 'auto')}}"
    video-width="{{utils.getValue(item.videoWidth, 360)}}"
    video-height="{{utils.getValue(item.videoHeight, 640)}}"
    beauty-style="{{utils.getValue(item.beautyStyle, 'smooth')}}"
    filter="{{utils.getValue(item.filter, 'standard')}}"
    bindstatechange="eventHandler"
    bindnetstatus="eventHandler"
    binderror="eventHandler"
    bindbgmstart="eventHandler"
    bindbgmprogress="eventHandler"
    bindbgmcomplete="eventHandler"
    bindaudiovolumenotify="eventHandler"
  >
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </live-pusher>
</template>

<template name="tmpl_0_canvas">
  <canvas
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
    type="{{utils.getValue(item.type, '')}}"
    canvas-id="{{utils.getValue(item.canvasId, '')}}"
    disable-scroll="{{utils.getValue(item.disableScroll, false)}}"
    bindtouchstart="eventHandler"
    bindtouchmove="eventHandler"
    bindtouchend="eventHandler"
    bindtouchcancel="eventHandler"
    bindlongtap="eventHandler"
    binderror="eventHandler"
  >
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </canvas>
</template>

<template name="tmpl_0_keyboard-accessory">
  <keyboard-accessory
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
  >
    <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>
  </keyboard-accessory>
</template>

      `

/**
 * 获取自定义字符串代表的字符集
 * @param customComponentConfig 自定义组件配置
 */
 function getCustomComponentStrByConfig(customComponentConfig?: CustomComponentConfig): string{
    if(!customComponentConfig || typeof customComponentConfig !== "object"){
      return ""
    }
    const resultStrList: string[] = []
    // 遍历使用到的自定义组件 key是标签名
    Object.keys(customComponentConfig).forEach((tagName) => {
      const customComponentSimpleProps: CustomComponentSimpleProps = customComponentConfig[tagName]
      const attributeKeyValueObj: AttributeConfig = customComponentSimpleProps.attribute
      // 属性集合
      const attributeList: string[] = []
      // 加入id
      attributeList.push(`id="{{item.uid}}"`)
      Object.keys(attributeKeyValueObj).forEach(key => {
        // 获取属性对应的字符串名 有两种情况，一是事件，二是从渲染数据获取数据
        const valueStr = attributeKeyValueObj[key]
        attributeList.push(`${key}="${key.indexOf("bind") === 0 ? valueStr : ("{{item."+valueStr+"}}")}"`)
      })
      const attributeStr = attributeList.join(" ")
      // 是否含有子节点
      const hasChildren = customComponentSimpleProps.hasChildren
      // children的字符串
      const childrenStr = `\n   <template is="{{utils.getTemplateByCid(cid+1)}}" data="{{${vdomsKey}: item.${childrenKey}, cid: cid+1}}"></template>\n  `
      // 拼接的字符串
      const resultStr = `
  <template name="tmpl_0_${tagName}">
    <${tagName} ${attributeStr}>${hasChildren ? childrenStr : ""}</${tagName}>
  </template>
  `
      resultStrList.push(resultStr)
    })
    return resultStrList.join("")
}

/**
 * 生成import列表
 * @param importlist import 列表
 * @returns 
 */
 function genImportListCode(importlist: ImportTag[] = [], wxmlPath: string): string{
    // 处理src
    let result = Array.isArray(importlist) ? importlist.map((importTag: ImportTag) => {
      let originSrc = importTag?.src || ""
      // 判断是不是相对文件路径
      let isRelativePath = originSrc.indexOf(".") === 0
      if(!isRelativePath){
        // 拿到转换后的相对路径
        originSrc = path.relative(path.join(wxmlPath, "../"), originSrc)
        if(originSrc.indexOf(".") !== 0){
          originSrc = "./" + originSrc
        }
      }
      return `<import src="${originSrc}"/>`
    }).join("\n") : ""
    return result
}

