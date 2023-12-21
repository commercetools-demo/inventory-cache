"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiRoot = void 0;
const build_client_1 = require("./build.client");
const platform_sdk_1 = require("@commercetools/platform-sdk");
const config_utils_1 = require("../utils/config.utils");
/**
 * Create client with apiRoot
 * apiRoot can now be used to build requests to de Composable Commerce API
 */
exports.createApiRoot = ((root) => () => {
    if (root) {
        return root;
    }
    root = (0, platform_sdk_1.createApiBuilderFromCtpClient)((0, build_client_1.createClient)()).withProjectKey({
        projectKey: (0, config_utils_1.readConfiguration)().projectKey,
    });
    return root;
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLmNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9DVC9jbGllbnQvY3JlYXRlLmNsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpREFBOEM7QUFFOUMsOERBQTRFO0FBRTVFLHdEQUEwRDtBQUcxRDs7O0dBR0c7QUFDVSxRQUFBLGFBQWEsR0FBRyxDQUFDLENBQUMsSUFBaUMsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFO0lBQ3hFLElBQUksSUFBSSxFQUFFO1FBQ1IsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVELElBQUksR0FBRyxJQUFBLDRDQUE2QixFQUFDLElBQUEsMkJBQVksR0FBRSxDQUFDLENBQUMsY0FBYyxDQUFDO1FBQ2xFLFVBQVUsRUFBRSxJQUFBLGdDQUFpQixHQUFFLENBQUMsVUFBVTtLQUMzQyxDQUFDLENBQUM7SUFFSCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQyxFQUFFLENBQUMifQ==