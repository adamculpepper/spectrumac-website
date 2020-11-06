require('dotenv').config({path: __dirname + '/.env.dev'});

const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-es");
const htmlmin = require("html-minifier");
const slugify = require("slugify");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function(eleventyConfig) {

	// Eleventy Navigation https://www.11ty.dev/docs/plugins/navigation/
	eleventyConfig.addPlugin(eleventyNavigationPlugin);

	// Configuration API: use eleventyConfig.addLayoutAlias(from, to) to add
	// layout aliases! Say you have a bunch of existing content using
	// layout: post. If you don’t want to rewrite all of those values, just map
	// post to a new file like this:
	// eleventyConfig.addLayoutAlias("post", "layouts/my_new_post_layout.njk");

	// Merge data instead of overriding
	// https://www.11ty.dev/docs/data-deep-merge/
	eleventyConfig.setDataDeepMerge(true);

	// Date formatting (human readable)
	eleventyConfig.addFilter("readableDate", dateObj => {
		return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
	});

	// Date formatting (machine readable)
	eleventyConfig.addFilter("machineDate", dateObj => {
		return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
	});

	// Minify CSS
	eleventyConfig.addFilter("cssmin", function(code) {
		return new CleanCSS({}).minify(code).styles;
	});

	// Minify JS
	eleventyConfig.addFilter("jsmin", function(code) {
		let minified = UglifyJS.minify(code);
		if (minified.error) {
			console.log("UglifyJS error: ", minified.error);
			return code;
		}
		return minified.code;
	});

	// Minify HTML output
	if (process.env.ELEVENTY_ENV == 'production') {
		eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
			if (outputPath.indexOf(".html") > -1) {
				let minified = htmlmin.minify(content, {
					useShortDoctype: true,
					removeComments: true,
					collapseWhitespace: true
				});
				return minified;
			}
			return content;
		});
	}

	// Universal slug filter strips unsafe chars from URLs
	eleventyConfig.addFilter("slugify", function(str) {
		return slugify(str, {
			lower: true,
			replacement: "-",
			remove: /[*+~.·,()'"`´%!?¿:@]/g
		});
	});

	// Don't process folders with static assets e.g. images
	eleventyConfig.addPassthroughCopy("favicon.ico");
	eleventyConfig.addPassthroughCopy("static/img");
	eleventyConfig.addPassthroughCopy("admin");
	eleventyConfig.addPassthroughCopy("_includes/assets/");

	/* Markdown Plugins */
	let markdownIt = require("markdown-it");
	let markdownItAttrs = require('markdown-it-attrs');
	let markdownItAnchor = require("markdown-it-anchor");
	let options = {
		html: true,
		breaks: true,
		linkify: true
	};
	let opts = {
		permalink: false
	};

	eleventyConfig.setLibrary("md", markdownIt(options)
		.use(markdownItAnchor, opts)
		.use(require('markdown-it-container'), '', {
			validate: () => true,
			render: (tokens, idx) => {
				if (tokens[idx].nesting === 1) {
					const classList = tokens[idx].info.trim()
					return `<div ${classList && `class="${classList}"`}>`;
				} else {
					return `</div>`;
				}
			}
		})
		.use(markdownItAttrs)
	);

	//module.exports = function(eleventyConfig, pluginNamespace) {
		//eleventyConfig.namespace(pluginNamespace, () => {
			eleventyConfig.addShortcode('imgresp', parameter => {
				var errors = '';

				if (!parameter.path) {
					errors += 'path parameter missing!';
				} else if (!parameter.sizes) {
					errors += 'sizes parameter missing!';
				}

				if (errors) {
					return '<span style="background:lightsalmon; padding:5px;">' + errors + '</span>';
				} else {
					const hostname = eleventyConfig.hostname ? eleventyConfig.hostname : '';
					const arraySizes = parameter.sizes.replace(/ /g,'').split(',');
					const maxSize = Math.max.apply(Math, arraySizes);
					const baseUrl = `https://res.cloudinary.com/${eleventyConfig.cloudinaryCloudName}/image/fetch/`;
					const imageSrc = `${baseUrl}q_auto,f_auto,w_${maxSize}/${hostname}${parameter.path}`;
					const srcset = arraySizes.map(width => {
						return `${baseUrl}q_auto,f_auto,w_${width}/${hostname}${parameter.path} ${width}w`;
					}).join(',');

					return '<img ' +
						(parameter.width ? ' width="' + parameter.width + '"' : '') +
						(parameter.height ? ' height="' + parameter.height + '"' : '') +
						(parameter.sizes ? ' sizes="(max-width: ' + maxSize + 'px) 100vw, ' + maxSize + 'px"' : '') +
						' src="' + imageSrc + '"' +
						' srcset="' + srcset + '"' +
						(parameter.alt ? ' alt="' + parameter.alt.trim() + '"' : '') +
						(parameter.classes ? ' class="' + parameter.classes + '"' : '') +
						'>';
				}
			});
		//});
	//};

	/* Plugin: eleventy-plugin-respimg */
	//const pluginRespimg = require('eleventy-plugin-respimg');
	eleventyConfig.cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
	eleventyConfig.hostname = 'https://spectrumac.netlify.app';
	//eleventyConfig.addPlugin( pluginRespimg );


	return {
		templateFormats: ["md", "njk", "html", "liquid"],

		// If your site lives in a different subdirectory, change this.
		// Leading or trailing slashes are all normalized away, so don’t worry about it.
		// If you don’t have a subdirectory, use "" or "/" (they do the same thing)
		// This is only used for URLs (it does not affect your file structure)
		pathPrefix: "/",

		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
		dataTemplateEngine: "njk",
		dir: {
			input: ".",
			includes: "_includes",
			data: "_data",
			output: "_site"
		}
	};
};
