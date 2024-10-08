u8R"(
$.Osiris = (function () {
  var activeTab;
  var activeSubTab = {};

  return {
    rootPanel: (function () {
      const rootPanel = $.CreatePanel('Panel', $.GetContextPanel(), 'OsirisMenuTab', {
        class: "mainmenu-content__container",
        useglobalcontext: "true"
      });

      rootPanel.visible = false;
      rootPanel.SetReadyForDisplay(false);
      rootPanel.RegisterForReadyEvents(true);
      $.RegisterEventHandler('PropertyTransitionEnd', rootPanel, function (panelName, propertyName) {
        if (rootPanel.id === panelName && propertyName === 'opacity') {
          if (rootPanel.visible === true && rootPanel.BIsTransparent()) {
            rootPanel.visible = false;
            rootPanel.SetReadyForDisplay(false);
            return true;
          } else if (newPanel.visible === true) {
            $.DispatchEvent('MainMenuTabShown', 'OsirisMenuTab');
          }
        }
        return false;
      });

      return rootPanel;
    })(),
    goHome: function () {
      $.DispatchEvent('Activated', this.rootPanel.GetParent().GetParent().GetParent().FindChildInLayoutFile("MainMenuNavBarHome"), 'mouse');
    },
    addCommand: function (command, value = '') {
      var existingCommands = this.rootPanel.GetAttributeString('cmd', '');
      this.rootPanel.SetAttributeString('cmd', existingCommands + command + ' ' + value);
    },
    navigateToTab: function (tabID) {
      if (activeTab === tabID)
        return;

      if (activeTab) {
        var panelToHide = this.rootPanel.FindChildInLayoutFile(activeTab);
        panelToHide.RemoveClass('Active');
      }

      this.rootPanel.FindChildInLayoutFile(tabID + '_button').checked = true;

      activeTab = tabID;
      var activePanel = this.rootPanel.FindChildInLayoutFile(tabID);
      activePanel.AddClass('Active');
      activePanel.visible = true;
      activePanel.SetReadyForDisplay(true);
    },
    navigateToSubTab: function (tabID, subTabID) {
      if (activeSubTab[tabID] === subTabID)
        return;

      if (activeSubTab[tabID]) {
        var panelToHide = this.rootPanel.FindChildInLayoutFile(activeSubTab[tabID]);
        panelToHide.RemoveClass('Active');
      }

      this.rootPanel.FindChildInLayoutFile(subTabID + '_button').checked = true;

      activeSubTab[tabID] = subTabID;
      var activePanel = this.rootPanel.FindChildInLayoutFile(subTabID);
      activePanel.AddClass('Active');
      activePanel.visible = true;
      activePanel.SetReadyForDisplay(true);
    },
    dropDownUpdated: function (tabID, dropDownID) {
      this.addCommand('set', tabID + '/' + dropDownID + '/' + this.rootPanel.FindChildInLayoutFile(dropDownID).GetSelected().GetAttributeString('value', ''));
    }
  };
})();

(function () {
  var createNavbar = function () {
    var navbar = $.CreatePanel('Panel', $.Osiris.rootPanel, '', {
      class: "content-navbar__tabs content-navbar__tabs--noflow"
    });

    var leftContainer = $.CreatePanel('Panel', navbar, '', {
      style: "horizontal-align: left; flow-children: right; height: 100%; padding-left: 5px;"
    });

    var unloadButton = $.CreatePanel('Button', leftContainer, 'UnloadButton', {
      class: "content-navbar__tabs__btn",
      onactivate: "UiToolkitAPI.ShowGenericPopupOneOptionCustomCancelBgStyle('\u5378\u8f7d Osiris', '\u786e\u5b9a\u5378\u8f7d Osiris \u5417?', '', '\u786e\u5b9a', function() { $.Osiris.goHome(); $.Osiris.addCommand('unload'); }, '\u53d6\u6d88', function() {}, 'dim');"
    });

    unloadButton.SetPanelEvent('onmouseover', function () { UiToolkitAPI.ShowTextTooltip('UnloadButton', '\u5378\u8f7d'); });
    unloadButton.SetPanelEvent('onmouseout', function () { UiToolkitAPI.HideTextTooltip(); });

    $.CreatePanel('Image', unloadButton, '', {
      src: "s2r://panorama/images/icons/ui/cancel.vsvg",
      texturewidth: "24",
      class: "negativeColor"
    });

    var centerContainer = $.CreatePanel('Panel', navbar, '', {
      class: "content-navbar__tabs__center-container",
    });

    var hudTabButton = $.CreatePanel('RadioButton', centerContainer, 'hud_button', {
      group: "SettingsNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToTab('hud');"
    });

    $.CreatePanel('Label', hudTabButton, '', { text: "\u754c\u9762 | HUD" });

    var visualsTabButton = $.CreatePanel('RadioButton', centerContainer, 'visuals_button', {
      group: "SettingsNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToTab('visuals');"
    });

    $.CreatePanel('Label', visualsTabButton, '', { text: "\u89c6\u89c9 | Visuals" });
    
    var soundTabButton = $.CreatePanel('RadioButton', centerContainer, 'sound_button', {
      group: "SettingsNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToTab('sound');"
    });

    $.CreatePanel('Label', soundTabButton, '', { text: "\u58f0\u97f3 | Sound" });
  };

  var createVisualsNavbar = function () {
    var navbar = $.CreatePanel('Panel', $.Osiris.rootPanel.FindChildInLayoutFile('visuals'), '', {
      class: "content-navbar__tabs content-navbar__tabs--dark content-navbar__tabs--noflow"
    });

    var centerContainer = $.CreatePanel('Panel', navbar, '', {
      class: "content-navbar__tabs__center-container",
    });

    var playerInfoTabButton = $.CreatePanel('RadioButton', centerContainer, 'player_info_button', {
      group: "VisualsNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToSubTab('visuals', 'player_info');"
    });

    $.CreatePanel('Label', playerInfoTabButton, '', { text: "\u4e16\u754c\u4e2d\u7684\u73a9\u5bb6\u4fe1\u606f | Player Info In World" });

    var outlineGlowTabButton = $.CreatePanel('RadioButton', centerContainer, 'outline_glow_button', {
      group: "VisualsNavBar",
      class: "content-navbar__tabs__btn",
      onactivate: "$.Osiris.navigateToSubTab('visuals', 'outline_glow');"
    });

    $.CreatePanel('Label', outlineGlowTabButton, '', { text: "\u8fb9\u6846\u53d1\u5149 | Outline Glow" });
  };

  createNavbar();

  var settingContent = $.CreatePanel('Panel', $.Osiris.rootPanel, 'SettingsMenuContent', {
    class: "full-width full-height"
  });

  var createTab = function(tabName) {
    var tab = $.CreatePanel('Panel', settingContent, tabName, {
      useglobalcontext: "true",
      class: "SettingsMenuTab"
    });

    var content = $.CreatePanel('Panel', tab, '', {
      class: "SettingsMenuTabContent vscroll"
    });
  
    return content;
  };

  var createVisualsTab = function() {
    var tab = $.CreatePanel('Panel', settingContent, 'visuals', {
      useglobalcontext: "true",
      class: "SettingsMenuTab"
    });

    createVisualsNavbar();

    var content = $.CreatePanel('Panel', tab, '', {
      class: "full-width full-height"
    });
  
    return content;
  };

  var createSubTab = function(tab, subTabName) {
    var subTab = $.CreatePanel('Panel', tab, subTabName, {
      useglobalcontext: "true",
      class: "SettingsMenuTab"
    });

    var content = $.CreatePanel('Panel', subTab, '', {
      class: "SettingsMenuTabContent vscroll"
    });
    return content;
  };

  var createSection = function(tab, sectionName) {
    var background = $.CreatePanel('Panel', tab, '', {
      class: "SettingsBackground"
    });

    var titleContainer = $.CreatePanel('Panel', background, '', {
      class: "SettingsSectionTitleContianer"
    });

    $.CreatePanel('Label', titleContainer, '', {
      class: "SettingsSectionTitleLabel",
      text: sectionName
    });

    var content = $.CreatePanel('Panel', background, '', {
      class: "top-bottom-flow full-width"
    });

    return content;
  };

  var createDropDown = function (parent, labelText, section, feature, options, defaultIndex = 1) {
    var container = $.CreatePanel('Panel', parent, '', {
      class: "SettingsMenuDropdownContainer"
    });

    $.CreatePanel('Label', container, '', {
      class: "half-width",
      text: labelText
    });

    var dropdown = $.CreatePanel('CSGOSettingsEnumDropDown', container, feature, {
      class: "PopupButton White",
      oninputsubmit: `$.Osiris.dropDownUpdated('${section}', '${feature}');`
    });

    for (let i = 0; i < options.length; ++i) {
      dropdown.AddOption($.CreatePanel('Label', dropdown, i, {
      value: i,
      text: options[i]
      }));
    }

    dropdown.SetSelectedIndex(defaultIndex);
    dropdown.RefreshDisplay();
  };

  var createOnOffDropDown = function (parent, labelText, section, feature) {
    createDropDown(parent, labelText, section, feature, ["\u5f00\u542f", "\u5173\u95ed"]);
  };

  var createYesNoDropDown = function (parent, labelText, section, feature, defaultIndex = 1) {
    createDropDown(parent, labelText, section, feature, ["\u662f", "\u5426"], defaultIndex);
  };

  var hud = createTab('hud');

  var bomb = createSection(hud, 'C4');
  createYesNoDropDown(bomb, "\u663e\u793aC4\u7206\u70b8\u5269\u4f59\u65f6\u95f4\u4e0e\u4f4d\u7f6e", 'hud', 'bomb_timer');
  $.CreatePanel('Panel', bomb, '', { class: "horizontal-separator" });
  createYesNoDropDown(bomb, "\u663e\u793aC4\u62c6\u9664\u5269\u4f59\u65f6\u95f4", 'hud', 'defusing_alert');

  var killfeed = createSection(hud, '\u51fb\u6740\u63d0\u793a');
  $.CreatePanel('Panel', killfeed, '', { class: "horizontal-separator" });
  createYesNoDropDown(killfeed, "\u4fdd\u5b58\u4e00\u5c40\u4e2d\u7684\u51fb\u6740\u63d0\u793a", 'hud', 'preserve_killfeed');

  var time = createSection(hud, '\u65f6\u95f4');
  $.CreatePanel('Panel', time, '', { class: "horizontal-separator" });
  createYesNoDropDown(time, "\u4e0b\u4e00\u5c40\u8ba1\u65f6", 'hud', 'postround_timer');

  var visuals = createVisualsTab();

  var playerInfoTab = createSubTab(visuals, 'player_info');

  var playerInfo = createSection(playerInfoTab, '\u4e16\u754c\u4e2d\u7684\u73a9\u5bb6\u4fe1\u606f');
  createDropDown(playerInfo, "\u542f\u7528", 'visuals', 'player_information_through_walls', ['\u4ec5\u654c\u4eba', '\u6240\u6709\u73a9\u5bb6', '\u5173\u95ed'], 2);
  $.CreatePanel('Panel', playerInfo, '', { class: "horizontal-separator" });
  createYesNoDropDown(playerInfo, "\u4f7f\u7528\u7bad\u5934\u6807\u51fa\u73a9\u5bb6\u4f4d\u7f6e", 'visuals', 'player_info_position', 0);
  $.CreatePanel('Panel', playerInfo, '', { class: "horizontal-separator" });
  createDropDown(playerInfo, "\u7bad\u5934\u989c\u8272", 'visuals', 'player_info_position_color', ['\u73a9\u5bb6/\u961f\u4f0d\u989c\u8272', '\u961f\u4f0d\u989c\u8272'], 0);
  $.CreatePanel('Panel', playerInfo, '', { class: "horizontal-separator" });
  createYesNoDropDown(playerInfo, "\u663e\u793a\u73a9\u5bb6\u751f\u547d\u503c", 'visuals', 'player_info_health', 0);
  $.CreatePanel('Panel', playerInfo, '', { class: "horizontal-separator" });
  createDropDown(playerInfo, "\u751f\u547d\u503c\u6587\u672c\u989c\u8272", 'visuals', 'player_info_health_color', ['\u57fa\u4e8e\u751f\u547d\u503c', '\u767d\u8272'], 0);
  $.CreatePanel('Panel', playerInfo, '', { class: "horizontal-separator" });
  createYesNoDropDown(playerInfo, "\u663e\u793a\u73a9\u5bb6\u5f53\u524d\u6b66\u5668", 'visuals', 'player_info_weapon', 0);
  $.CreatePanel('Panel', playerInfo, '', { class: "horizontal-separator" });
  createYesNoDropDown(playerInfo, "\u663e\u793a\u73a9\u5bb6\u5f53\u524d\u6b66\u5668\u5f39\u836f", 'visuals', 'player_info_weapon_clip', 0);
  $.CreatePanel('Panel', playerInfo, '', { class: "horizontal-separator" });
  createYesNoDropDown(playerInfo, "\u663e\u793a\u62c6\u9664\u56fe\u6807", 'visuals', 'player_info_defuse', 0);
  $.CreatePanel('Panel', playerInfo, '', { class: "horizontal-separator" });
  createYesNoDropDown(playerInfo, '\u663e\u793a\u6361\u8d77\u4eba\u8d28\u56fe\u6807', 'visuals', 'player_info_hostage_pickup', 0);
  $.CreatePanel('Panel', playerInfo, '', { class: "horizontal-separator" });
  createYesNoDropDown(playerInfo, '\u663e\u793a\u8425\u6551\u4eba\u8d28\u56fe\u6807', 'visuals', 'player_info_hostage_rescue', 0);
  $.CreatePanel('Panel', playerInfo, '', { class: "horizontal-separator" });
  createYesNoDropDown(playerInfo, '\u663e\u793a\u88ab\u95ea\u5149\u5f39\u81f4\u76f2\u56fe\u6807', 'visuals', 'player_info_blinded', 0);

  var outlineGlowTab = createSubTab(visuals, 'outline_glow');

  var outlineGlow = createSection(outlineGlowTab, '\u8f6e\u5ed3\u53d1\u5149');
  createOnOffDropDown(outlineGlow, "\u4e3b\u5f00\u5173", 'visuals', 'outline_glow_enable');

  var playerOutlineGlow = createSection(outlineGlowTab, '\u73a9\u5bb6\u8fb9\u6846\u53d1\u5149');
  createDropDown(playerOutlineGlow, "\u542f\u7528", 'visuals', 'player_outline_glow', ['\u4ec5\u654c\u4eba', '\u6240\u6709\u73a9\u5bb6', '\u5173\u95ed'], 0);
  $.CreatePanel('Panel', playerOutlineGlow, '', { class: "horizontal-separator" });
  createDropDown(playerOutlineGlow, "\u73a9\u5bb6\u8fb9\u6846\u53d1\u5149\u989c\u8272", 'visuals', 'player_outline_glow_color', ['\u73a9\u5bb6/\u961f\u4f0d\u989c\u8272', '\u961f\u4f0d\u989c\u8272', '\u57fa\u4e8e\u8840\u91cf'], 0);

  var weaponOutlineGlow = createSection(outlineGlowTab, '\u6b66\u5668');
  createYesNoDropDown(weaponOutlineGlow, "\u9644\u8fd1\u5730\u9762\u4e0a\u7684\u6b66\u5668\u53d1\u5149", 'visuals', 'weapon_outline_glow', 0);
  $.CreatePanel('Panel', weaponOutlineGlow, '', { class: "horizontal-separator" });
  createYesNoDropDown(weaponOutlineGlow, "\u6295\u51fa\u7684\u624b\u69b4\u5f39\u53d1\u5149", 'visuals', 'grenade_proj_outline_glow', 0);

  var bombAndDefuseKitOutlineGlow = createSection(outlineGlowTab, 'C4\u548c\u62c6\u5f39\u5de5\u5177');
  createYesNoDropDown(bombAndDefuseKitOutlineGlow, "\u6389\u843d\u7684C4\u53d1\u5149", 'visuals', 'dropped_bomb_outline_glow', 0);
  $.CreatePanel('Panel', bombAndDefuseKitOutlineGlow, '', { class: "horizontal-separator" });
  createYesNoDropDown(bombAndDefuseKitOutlineGlow, "\u5b89\u88c5\u7684C4\u53d1\u5149", 'visuals', 'ticking_bomb_outline_glow', 0);
  $.CreatePanel('Panel', bombAndDefuseKitOutlineGlow, '', { class: "horizontal-separator" });
  createYesNoDropDown(bombAndDefuseKitOutlineGlow, "\u9644\u8fd1\u7684\u62c6\u5f39\u5de5\u5177\u53d1\u5149", 'visuals', 'defuse_kit_outline_glow', 0);

  var hostageOutlineGlow = createSection(outlineGlowTab, '\u4eba\u8d28');
  createYesNoDropDown(hostageOutlineGlow, "\u4eba\u8d28\u53d1\u5149", 'visuals', 'hostage_outline_glow', 0);

  $.Osiris.navigateToSubTab('visuals', 'player_info');

  var sound = createTab('sound');
  
  var playerSoundVisualization = createSection(sound, '\u73a9\u5bb6\u58f0\u97f3\u53ef\u89c6\u5316');
  $.CreatePanel('Panel', playerSoundVisualization, '', { class: "horizontal-separator" });
  createYesNoDropDown(playerSoundVisualization, "\u53ef\u89c6\u5316\u811a\u6b65\u58f0", 'sound', 'visualize_player_footsteps');

  var bombSoundVisualization = createSection(sound, 'C4\u97f3\u6548\u53ef\u89c6\u5316');
  createYesNoDropDown(bombSoundVisualization, "\u53ef\u89c6\u5316\u5b89\u653eC4\u97f3\u6548", 'sound', 'visualize_bomb_plant');
  $.CreatePanel('Panel', bombSoundVisualization, '', { class: "horizontal-separator" });
  createYesNoDropDown(bombSoundVisualization, "\u53ef\u89c6\u5316C4\u54cd\u97f3\u6548", 'sound', 'visualize_bomb_beep');
  $.CreatePanel('Panel', bombSoundVisualization, '', { class: "horizontal-separator" });
  createYesNoDropDown(bombSoundVisualization, "\u53ef\u89c6\u5316C4\u62c6\u9664\u97f3\u6548", 'sound', 'visualize_bomb_defuse');

  var weaponSoundVisualization = createSection(sound, '\u6b66\u5668\u97f3\u6548\u53ef\u89c6\u5316');
  createYesNoDropDown(weaponSoundVisualization, "\u53ef\u89c6\u5316\u7784\u51c6\u97f3\u6548", 'sound', 'visualize_scope_sound');
  $.CreatePanel('Panel', weaponSoundVisualization, '', { class: "horizontal-separator" });
  createYesNoDropDown(weaponSoundVisualization, "\u53ef\u89c6\u5316\u6362\u5f39\u97f3\u6548", 'sound', 'visualize_reload_sound');

  $.Osiris.navigateToTab('hud');
})();
)"
