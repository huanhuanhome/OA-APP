import { permissionFunc } from '@/common/permission'

export const action = {
    bind: function(el, binding, vnode, oldVnode) {
        const result = permissionFunc(binding.value)
        if (result) {
            // el.style.display = 'block'
        } else {
            el.style.display = 'none'
        }
    }
}
