---
layout: layouts/home.njk
title: Home
date: 2016-01-01T00:00:00.000Z
permalink: /
eleventyNavigation:
  key: Home
  order: 0
---

{% set homeContentImageAlt -%}
	{{metadata.company_info.company_name}}, Baker Louisiana Location
{% endset -%}

:::: row
::: col-lg-4
{% imgresp
	path="/_includes/assets/uploads/content-home-spectrum-ac-and-heating.jpg",
	alt=homeContentImageAlt,
	sizes="200, 280, 360",
	classes="img-fluid pretty moop"
%}
:::
::: col-lg-8 mt-3 mt-lg-0 list-unstyled
* Let Our Family{.text1}
* Take care of yours!{.text2}
:::
::::
