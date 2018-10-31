Button
======

A Button is a clickable user interface element that can trigger actions upon those clicks.



##Props

Property | Description
---------|-------------
type | Which appearance should the button have? Can either be `Button.TYPES.DEFAULT`, `Button.TYPES.PRIMARY` or `Button.TYPES.MINIMAL`.
label | The label to be put on the button. Can be either a string, or a React Component.
children | Alternative to label
title | A tooltip to be displayed on the Button.
enabled | Should the button be clickable? Default: `true`
className | Additional CSS class names to be applied to the button.
onClick | Attach a function here to be called upon clicks. 
icon | Pass the name of an icon here, to show it on the button. If you leave `label` and `children` empty, the button will render as icon-only.

## Static values

### Button.TYPES.DEFAULT
Resolves to `0`. Constant to be used for the `type` prop.

### Button.TYPES.PRIMARY
Resolves to `1`. Constant to be used for the `type` prop.

### Button.TYPES.MINIMAL
Resolves to `2`. Constant to be used for the `type` prop.


## CSS Classes

### mdo-button
Applied to the button element all the time.

### mdo-default
Applied, if the button is of type `Button.TYPES.DEFAULT`.

### mdo-primary
Applied, if the button is of type `Button.TYPES.PRIMARY`.

### mdo-minimal
Applied, if the button is of type `Button.TYPES.MINIMAL`.

## mdo-has-icon
Applied, if the button incorporates an icon, set through
the `icon` prop.

### mdo-only-icon
If the `label` and `children` props are left out, but an `icon`
has been set, this class will be applied.

### mdo-disabled
Applied, if the button is not enabled.
