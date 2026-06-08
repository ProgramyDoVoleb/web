<!-- <template src="./src/template.html"></template>
<script src="./src/script.js"></script>
<style lang="scss" scoped src="./src/style.scss"></style> -->
<style>
    .p-list-linear {
        display: inline-block;
        margin: 0;
        padding: 0;
        list-style: none;

            &.inline {
                display: inline;
            }
    }
</style>

<script setup>
    
    import { useSlots, useAttrs, h, computed } from 'vue'
    
    const slots = useSlots()
    const attrs = useAttrs()

    const listnode = () => {

        var delimiters = [', ', ' a '];

        if (attrs.class && attrs.class.includes('nebo')) {
            delimiters = [', ', ' nebo '];
        }

        if (attrs.class && attrs.class.includes('or')) {
            delimiters = [' · ', ' · '];
        }

        const sloted = slots.default();
        const list = [];

        function addToList (item) {
            if (list.length > 0 && list[list.length - 1] !== delimiters[0]) {
                list.push(h('span', {class: 'dvd'}, delimiters[0]));
            }
            list.push(item);
        }

        // console.log(sloted, sloted.map(x => typeof x.type));

        try {

            sloted.forEach(vnode => {
                if ((typeof vnode.children === 'string' && ['v-if'].indexOf(vnode.children) > -1) || vnode.patchFlag === -2) {
                    // nothing
                } else if (typeof vnode.type === 'string' || typeof vnode.children === 'string') {
                    addToList(vnode); 
                } else {
                    // console.log(vnode.children);
                    vnode.children.forEach(cnode => {
                        addToList(cnode);
                    })
                } 
            });

        } catch (e) {
            console.warn('Chyba v seznamu vnodes:', sloted, sloted.map(x => typeof x.type));
        }

        if (list.length > 1) {
            list[list.length - 2] = h('span', {class: 'dvd'}, delimiters[1]);
        }

        return h('ul', {class: 'p-list-linear'}, list);
    }

    // const listnode = computed(() => h('ul', {class: 'p-list-linear'}, list));

</script>

<template>
    
        <component :is="listnode" role="list"></component>
    
</template>