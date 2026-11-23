<script>
  const widths = [480, 768, 1200, 1440];

  let {
    slug,
    src,
    alt = '',
    width = 1440,
    height = 900,
    sizes = '100vw',
    className = ''
  } = $props();

  let avifSrcset = $derived(
    widths.map((item) => `/images/project-previews/optimized/${slug}-${item}.avif ${item}w`).join(', ')
  );
  let webpSrcset = $derived(
    widths.map((item) => `/images/project-previews/optimized/${slug}-${item}.webp ${item}w`).join(', ')
  );
</script>

<picture class="contents">
  <source type="image/avif" srcset={avifSrcset} {sizes} />
  <source type="image/webp" srcset={webpSrcset} {sizes} />
  <img {src} {alt} {width} {height} {sizes} loading="lazy" decoding="async" class={className} />
</picture>
