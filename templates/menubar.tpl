<div class="menubar menubarid-{{id}}">
  <ul>
    {{#menuitems}}
    <li>
      {{label}}
      <ul>
        {{#submenu}}
        <li class="menuitem-{{type}}" id="menuitem-{{id}}"><div class="menuitem-icon">{{icon}}</div>{{label}}</li>
        {{/submenu}}
      </ul>
    </li>
    {{/menuitems}}
  </ul>
</div>
