describe('Static rendering', function() {

  describe('HTML', function() {
    testStaticRendering(function test(options) {
      var html = options.template.get();
      expect(html).equal(options.html);
    });
  });

  describe('Fragment', function() {
    testStaticRendering(function test(options) {
      var fragment = options.template.getFragment();
      options.fragment(fragment);
    });
  });

});

describe('Dynamic rendering', function() {

  var context = getContext({
    show: true
  });

  describe('HTML', function() {
    testDynamicRendering(function test(options) {
      var html = options.template.get(context);
      expect(html).equal(options.html);
    });
  });

  describe('Fragment', function() {
    testDynamicRendering(function test(options) {
      var fragment = options.template.getFragment(context);
      options.fragment(fragment);
    });
  });

});

function testStaticRendering(test) {
  it('renders an empty div', function() {
    test({
      template: new saddle.Element('div')
    , html: '<div></div>'
    , fragment: function(fragment) {
        expect(fragment.childNodes.length).equal(1);
        expect(fragment.childNodes[0].tagName.toLowerCase()).equal('div');
      }
    });
  });

  it('renders a void element', function() {
    test({
      template: new saddle.Element('br')
    , html: '<br>'
    , fragment: function(fragment) {
        expect(fragment.childNodes.length).equal(1);
        expect(fragment.childNodes[0].tagName.toLowerCase()).equal('br');
      }
    });
  });

  it('renders a div with literal attributes', function() {
    test({
      template: new saddle.Element('div', new saddle.AttributesMap({
        id: new saddle.Attribute('page')
      , 'data-x': new saddle.Attribute('24')
      , 'class': new saddle.Attribute('content fit')
      }))
    , html: '<div id="page" data-x="24" class="content fit"></div>'
    , fragment: function(fragment) {
        expect(fragment.childNodes.length).equal(1);
        expect(fragment.childNodes[0].tagName.toLowerCase()).equal('div');
        expect(fragment.childNodes[0].id).equal('page');
        expect(fragment.childNodes[0].className).equal('content fit');
        expect(fragment.childNodes[0].getAttribute('data-x')).equal('24');
      }
    });
  });

  it('renders a true boolean attribute', function() {
    test({
      template: new saddle.Element('input', new saddle.AttributesMap({
        autofocus: new saddle.Attribute(true)
      }))
    , html: '<input autofocus>'
    , fragment: function(fragment) {
        expect(fragment.childNodes.length).equal(1);
        expect(fragment.childNodes[0].tagName.toLowerCase()).equal('input');
        expect(fragment.childNodes[0].getAttribute('autofocus')).not.eql(null);
      }
    });
  });

  it('renders a false boolean attribute', function() {
    test({
      template: new saddle.Element('input', new saddle.AttributesMap({
        autofocus: new saddle.Attribute(false)
      }))
    , html: '<input>'
    , fragment: function(fragment) {
        expect(fragment.childNodes.length).equal(1);
        expect(fragment.childNodes[0].tagName.toLowerCase()).equal('input');
        expect(fragment.childNodes[0].getAttribute('autofocus')).eql(null);
      }
    });
  });

  it('renders nested elements', function() {
    test({
      template: new saddle.Element('div', null, [
        new saddle.Element('div', null, [
          new saddle.Element('span')
        , new saddle.Element('span')
        ])
      ])
    , html: '<div><div><span></span><span></span></div></div>'
    , fragment: function(fragment) {
        expect(fragment.childNodes.length).equal(1);
        var node = fragment.childNodes[0];
        expect(node.tagName.toLowerCase()).equal('div');
        expect(node.childNodes.length).equal(1);
        var node = node.childNodes[0];
        expect(node.tagName.toLowerCase()).equal('div');
        expect(node.childNodes.length).equal(2);
        expect(node.childNodes[0].tagName.toLowerCase()).equal('span');
        expect(node.childNodes[0].childNodes.length).equal(0);
        expect(node.childNodes[1].tagName.toLowerCase()).equal('span');
        expect(node.childNodes[1].childNodes.length).equal(0);
      }
    });
  });

  it('renders a text node', function() {
    test({
      template: new saddle.Text('Hi')
    , html: 'Hi'
    , fragment: function(fragment) {
        expect(fragment.childNodes.length).equal(1);
        expect(fragment.childNodes[0].nodeType).equal(3);
        expect(fragment.childNodes[0].data).equal('Hi');
      }
    });
  });

  it('renders text nodes in an element', function() {
    test({
      template: new saddle.Element('div', null, [
        new saddle.Text('Hello, ')
      , new saddle.Text('world.')
      ])
    , html: '<div>Hello, world.</div>'
    , fragment: function(fragment) {
        expect(fragment.childNodes.length).equal(1);
        var node = fragment.childNodes[0];
        expect(node.tagName.toLowerCase()).equal('div');
        expect(node.childNodes.length).equal(2);
        expect(node.childNodes[0].nodeType).equal(3);
        expect(node.childNodes[0].data).equal('Hello, ');
        expect(node.childNodes[1].nodeType).equal(3);
        expect(node.childNodes[1].data).equal('world.');
      }
    });
  });

  it('renders a comment', function() {
    test({
      template: new saddle.Comment('Hi')
    , html: '<!--Hi-->'
    , fragment: function(fragment) {
        expect(fragment.childNodes.length).equal(1);
        expect(fragment.childNodes[0].nodeType).equal(8);
        expect(fragment.childNodes[0].data).equal('Hi');
      }
    });
  });

  it('renders a template', function() {
    test({
      template: new saddle.Template([
        new saddle.Comment('Hi')
      , new saddle.Element('div', null, [
          new saddle.Text('Ho')
        ])
      ])
    , html: '<!--Hi--><div>Ho</div>'
    , fragment: function(fragment) {
        expect(fragment.childNodes.length).equal(2);
        expect(fragment.childNodes[0].nodeType).equal(8);
        expect(fragment.childNodes[0].data).equal('Hi');
        var node = fragment.childNodes[1];
        expect(node.tagName.toLowerCase()).equal('div');
        expect(node.childNodes.length).equal(1);
        expect(node.childNodes[0].nodeType).equal(3);
        expect(node.childNodes[0].data).equal('Ho');
      }
    });
  });

  it('renders <input> value attribute', function() {
    test({
      template: new saddle.Element('input', new saddle.AttributesMap({
        value: new saddle.Attribute('hello')
      }))
    , html: '<input value="hello">'
    , fragment: function(fragment) {
        expect(fragment.childNodes[0].value).equal('hello');
        expect(fragment.childNodes[0].getAttribute('value')).equal('hello');
      }
    });
  });

  it('renders <input> checked attribute: true', function() {
    test({
      template: new saddle.Element('input', new saddle.AttributesMap({
        type: new saddle.Attribute('radio')
      , checked: new saddle.Attribute(true)
      }))
    , html: '<input type="radio" checked>'
    , fragment: function(fragment) {
        expect(fragment.childNodes[0].checked).equal(true);
      }
    });
  });

  it('renders <input> checked attribute: false', function() {
    test({
      template: new saddle.Element('input', new saddle.AttributesMap({
        type: new saddle.Attribute('radio')
      , checked: new saddle.Attribute(false)
      }))
    , html: '<input type="radio">'
    , fragment: function(fragment) {
        expect(fragment.childNodes[0].checked).equal(false);
      }
    });
  });
}

function testDynamicRendering(test) {
  // TODO: More tests

  it('renders a template as an attribute expression', function() {
    test({
      template: new saddle.Element('div', new saddle.AttributesMap({
        'class': new saddle.DynamicAttribute(new saddle.Template([
          new saddle.Text('dropdown')
        , new saddle.ConditionalBlock([
            new expressions.Expression('show')
          ], [
            [new saddle.Text(' show')]
          ])
        ]))
      }))
    , html: '<div class="dropdown show"></div>'
    , fragment: function(fragment) {
        expect(fragment.childNodes.length).equal(1);
        expect(fragment.childNodes[0].tagName.toLowerCase()).equal('div');
        expect(fragment.childNodes[0].className).equal('dropdown show');
      }
    });
  });

}

describe('attachTo', function() {
  var fixture = document.getElementById('fixture');

  after(function() {
    fixture.innerHTML = '';
  });

  function renderAndAttach(template, context) {
    fixture.innerHTML = template.get(context);
    template.attachTo(fixture, fixture.firstChild, context);
  }

  it('splits static text nodes', function() {
    var template = new saddle.Template([
      new saddle.Text('Hi')
    , new saddle.Text(' there.')
    ]);
    renderAndAttach(template);
    expect(fixture.childNodes.length).equal(2);
  });

  it('splits empty static text nodes', function() {
    var template = new saddle.Template([
      new saddle.Text('')
    , new saddle.Text('')
    ]);
    renderAndAttach(template);
    expect(fixture.childNodes.length).equal(2);
  });

  it('splits mixed empty static text nodes', function() {
    var template = new saddle.Template([
      new saddle.Text('')
    , new saddle.Text('Hi')
    , new saddle.Text('')
    , new saddle.Text('')
    , new saddle.Text(' there.')
    , new saddle.Text('')
    ]);
    renderAndAttach(template);
    expect(fixture.childNodes.length).equal(6);
  });

  it('adds empty text nodes around a comment', function() {
    var template = new saddle.Template([
      new saddle.Text('Hi')
    , new saddle.Text('')
    , new saddle.Comment('cool')
    , new saddle.Comment('thing')
    , new saddle.Text('')
    ]);
    renderAndAttach(template);
    expect(fixture.childNodes.length).equal(5);
  });

  it('attaches to elements without attributes', function() {
    var template = new saddle.Template([
      new saddle.Element('ul', null, [
        new saddle.Element('li', null, [
          new saddle.Text('One')
        ])
      , new saddle.Element('li', null, [
          new saddle.Text('Two')
        ])
      ])
    ]);
    renderAndAttach(template);
  });
});

// describe('replaceBindings', function() {

//   after(function() {
//     var fixture = document.getElementById('fixture');
//     fixture.innerHTML = '';
//   });

//   function renderAndReplace(template) {
//     var fixture = document.getElementById('fixture');
//     fixture.innerHTML = template.get();
//     var fragment = template.getFragment();
//     saddle.replaceBindings(fragment, fixture);
//   }

//   it('traverses a simple, valid DOM tree', function() {
//     var template = new saddle.Template([
//       new saddle.Comment('Hi')
//     , new saddle.Element('ul', null, [
//         new saddle.Element('li', null, [
//           new saddle.Text('Hi')
//         ])
//       ])
//     ]);
//     renderAndReplace(template);
//   });

//   it('traverses with comments in a table and select', function() {
//     // IE fails to create comments in certain locations when parsing HTML
//     var template = new saddle.Template([
//       new saddle.Element('table', null, [
//         new saddle.Comment('table comment')
//       , new saddle.Element('tbody', null, [
//           new saddle.Comment('tbody comment')
//         , new saddle.Element('tr', null, [
//             new saddle.Element('td')
//           ])
//         ])
//       ])
//     , new saddle.Element('select', null, [
//         new saddle.Comment('select comment start')
//       , new saddle.Element('option')
//       , new saddle.Comment('select comment inner')
//       , new saddle.Element('option')
//       , new saddle.Comment('select comment end')
//       , new saddle.Comment('select comment end 2')
//       ])
//     ]);
//     renderAndReplace(template);
//   });

//   it('throws when fragment does not match HTML', function() {
//     // This template is invalid HTML, and when it is parsed it will produce
//     // a different tree structure than when the nodes are created one-by-one
//     var template = new saddle.Template([
//       new saddle.Element('table', null, [
//         new saddle.Element('div', null, [
//           new saddle.Element('td', null, [
//             new saddle.Text('Hi')
//           ])
//         ])
//       ])
//     ]);
//     expect(function() {
//       renderAndReplace(template)
//     }).to.throwException();
//   });

// });

describe('Binding updates', function() {

  var fixture = document.getElementById('fixture');
  after(function() {
    fixture.innerHTML = '';
  });

  function render(template, data) {
    fixture.innerHTML = '';
    var bindings = [];
    var context = getContext(data, bindings);
    var fragment = template.getFragment(context);
    fixture.appendChild(fragment);
    return bindings;
  }

  it('updates a single TextNode', function() {
    var template = new saddle.Template([
      new saddle.DynamicText(new expressions.Expression('text'))
    ]);
    var binding = render(template).pop();
    expect(getText(fixture)).equal('');
    binding.context = getContext({text: 'Yo'});
    binding.update();
    expect(getText(fixture)).equal('Yo');
  });

  it('updates sibling TextNodes', function() {
    var template = new saddle.Template([
      new saddle.DynamicText(new expressions.Expression('first'))
    , new saddle.DynamicText(new expressions.Expression('second'))
    ]);
    var bindings = render(template, {second: 2});
    expect(bindings.length).equal(2);
    expect(getText(fixture)).equal('2');
    var context = getContext({first: 'one', second: 'two'});
    bindings[0].context = context;
    bindings[0].update();
    expect(getText(fixture)).equal('one2');
    bindings[1].context = context;
    bindings[1].update();
    expect(getText(fixture)).equal('onetwo');
  });

  it('updates a CommentNode', function() {
    var template = new saddle.Template([
      new saddle.DynamicComment(new expressions.Expression('comment'))
    ]);
    var binding = render(template, {comment: 'Hi'}).pop();
    expect(fixture.innerHTML).equal('<!--Hi-->');
    binding.context = getContext({comment: 'Bye'});
    binding.update();
    expect(fixture.innerHTML).equal('<!--Bye-->');
  });

  it('updates an Element attribute', function() {
    var template = new saddle.Template([
      new saddle.Element('div', new saddle.AttributesMap({
        'class': new saddle.Attribute('message')
      , 'data-greeting': new saddle.DynamicAttribute(new expressions.Expression('greeting'))
      }))
    ]);
    var binding = render(template).pop();
    var node = fixture.firstChild;
    expect(node.className).equal('message');
    expect(node.getAttribute('data-greeting')).eql(null);
    // Set initial value
    binding.context = getContext({greeting: 'Yo'});
    binding.update();
    expect(node.getAttribute('data-greeting')).equal('Yo');
    // Change value for same attribute
    binding.context = getContext({greeting: 'Hi'});
    binding.update();
    expect(node.getAttribute('data-greeting')).equal('Hi');
    // Remove value
    binding.context = getContext();
    binding.update();
    expect(node.getAttribute('data-greeting')).eql(null);
    // Dynamic updates don't affect static attribute
    expect(node.className).equal('message');
  });

  it('updates a Block', function() {
    var template = new saddle.Template([
      new saddle.Block(new expressions.Expression('author'), [
        new saddle.Element('h3', null, [
          new saddle.DynamicText(new expressions.Expression('name'))
        ])
      , new saddle.DynamicText(new expressions.Expression('name'))
      ])
    ]);
    var binding = render(template).pop();
    var children = getChildren(fixture);
    expect(children.length).equal(1);
    expect(children[0].tagName.toLowerCase()).equal('h3');
    expect(getText(children[0])).equal('');
    expect(getText(fixture)).equal('');
    // Update entire block context
    binding.context = getContext({author: {name: 'John'}});
    binding.update();
    var children = getChildren(fixture);
    expect(children.length).equal(1);
    expect(children[0].tagName.toLowerCase()).equal('h3');
    expect(getText(children[0])).equal('John');
    expect(getText(fixture)).equal('JohnJohn');
    // Reset to no data
    binding.context = getContext();
    binding.update();
    var children = getChildren(fixture);
    expect(children.length).equal(1);
    expect(children[0].tagName.toLowerCase()).equal('h3');
    expect(getText(children[0])).equal('');
    expect(getText(fixture)).equal('');
  });

  it('updates a single condition ConditionalBlock', function() {
    var template = new saddle.Template([
      new saddle.ConditionalBlock([
        new expressions.Expression('show')
      ], [
        [new saddle.Text('shown')]
      ])
    ]);
    var binding = render(template).pop();
    expect(getText(fixture)).equal('');
    // Update value
    binding.context = getContext({show: true});
    binding.update();
    expect(getText(fixture)).equal('shown');
    // Reset to no data
    binding.context = getContext({show: false});
    binding.update();
    expect(getText(fixture)).equal('');
  });

  it('updates a multi-condition ConditionalBlock', function() {
    var template = new saddle.Template([
      new saddle.ConditionalBlock([
        new expressions.Expression('primary')
      , new expressions.Expression('alternate')
      , new expressions.ElseExpression()
      ], [
        [new saddle.DynamicText(new expressions.Expression())]
      , []
      , [new saddle.Text('else')]
      ])
    ]);
    var binding = render(template).pop();
    expect(getText(fixture)).equal('else');
    // Update value
    binding.context = getContext({primary: 'Heyo'});
    binding.update();
    expect(getText(fixture)).equal('Heyo');
    // Update value
    binding.context = getContext({alternate: true});
    binding.update();
    expect(getText(fixture)).equal('');
    // Reset to no data
    binding.context = getContext();
    binding.update();
    expect(getText(fixture)).equal('else');
  });

  it('updates an each of text', function() {
    var template = new saddle.Template([
      new saddle.EachBlock(new expressions.Expression('items'), [
        new saddle.DynamicText(new expressions.Expression())
      ])
    ]);
    var binding = render(template).pop();
    expect(getText(fixture)).equal('');
    // Update value
    binding.context = getContext({items: ['One', 'Two', 'Three']});
    binding.update();
    expect(getText(fixture)).equal('OneTwoThree');
    // Update value
    binding.context = getContext({items: ['Four', 'Five']});
    binding.update();
    expect(getText(fixture)).equal('FourFive');
    // Update value
    binding.context = getContext({items: []});
    binding.update();
    expect(getText(fixture)).equal('');
    // Reset to no data
    binding.context = getContext();
    binding.update();
    expect(getText(fixture)).equal('');
  });

  it('updates an each with an else', function() {
    var template = new saddle.Template([
      new saddle.EachBlock(new expressions.Expression('items'), [
        new saddle.DynamicText(new expressions.Expression('name'))
      ], [
        new saddle.Text('else')
      ])
    ]);
    var binding = render(template).pop();
    expect(getText(fixture)).equal('else');
    // Update value
    binding.context = getContext({items: [
      {name: 'One'}, {name: 'Two'}, {name: 'Three'}
    ]});
    binding.update();
    expect(getText(fixture)).equal('OneTwoThree');
    // Update value
    binding.context = getContext({items: [
      {name: 'Four'}, {name: 'Five'}
    ]});
    binding.update();
    expect(getText(fixture)).equal('FourFive');
    // Update value
    binding.context = getContext({items: []});
    binding.update();
    expect(getText(fixture)).equal('else');
    // Reset to no data
    binding.context = getContext();
    binding.update();
    expect(getText(fixture)).equal('else');
  });

  it('inserts in an each', function() {
    var template = new saddle.Template([
      new saddle.EachBlock(new expressions.Expression('items'), [
        new saddle.DynamicText(new expressions.Expression('name'))
      ])
    ]);
    var binding = render(template).pop();
    expect(getText(fixture)).equal('');
    // Insert from null state
    var data = {items: [
      {name: 'One'}, {name: 'Two'}, {name: 'Three'}
    ]};
    binding.context = getContext(data);
    binding.insert(0, 3);
    expect(getText(fixture)).equal('OneTwoThree');
    // Insert new items
    data.items.splice(1, 0, {name: 'Four'}, {name: 'Five'});
    binding.insert(1, 2);
    expect(getText(fixture)).equal('OneFourFiveTwoThree');
  });

  it('removes in an each', function() {
    var template = new saddle.Template([
      new saddle.EachBlock(new expressions.Expression('items'), [
        new saddle.DynamicText(new expressions.Expression('name'))
      ])
    ]);
    var data = {items: [
      {name: 'One'}, {name: 'Two'}, {name: 'Three'}
    ]};
    var binding = render(template, data).pop();
    expect(getText(fixture)).equal('OneTwoThree');
    binding.context = getContext(data);
    // Remove inner item
    data.items.splice(1, 1);
    binding.remove(1, 1);
    expect(getText(fixture)).equal('OneThree');
    // Remove multiple remaining
    data.items.splice(0, 2);
    binding.remove(0, 2);
    expect(getText(fixture)).equal('');
  });

  it('moves in an each', function() {
    var template = new saddle.Template([
      new saddle.EachBlock(new expressions.Expression('items'), [
        new saddle.DynamicText(new expressions.Expression('name'))
      ])
    ]);
    var data = {items: [
      {name: 'One'}, {name: 'Two'}, {name: 'Three'}
    ]};
    var binding = render(template, data).pop();
    expect(getText(fixture)).equal('OneTwoThree');
    binding.context = getContext(data);
    // Move one item
    move(data.items, 1, 2, 1);
    binding.move(1, 2, 1);
    expect(getText(fixture)).equal('OneThreeTwo');
    // Move multiple items
    move(data.items, 1, 0, 2);
    binding.move(1, 0, 2);
    expect(getText(fixture)).equal('ThreeTwoOne');
  });

  it('insert, move, and remove with multiple node items', function() {
    var template = new saddle.Template([
      new saddle.EachBlock(new expressions.Expression('items'), [
        new saddle.Element('h3', null, [
          new saddle.DynamicText(new expressions.Expression('title'))
        ])
      , new saddle.DynamicText(new expressions.Expression('text'))
      ])
    ]);
    var data = {items: [
      {title: '1', text: 'one'}
    , {title: '2', text: 'two'}
    , {title: '3', text: 'three'}
    ]};
    var binding = render(template, data).pop();
    expect(getText(fixture)).equal('1one2two3three');
    binding.context = getContext(data);
    // Insert an item
    data.items.splice(2, 0, {title: '4', text: 'four'})
    binding.insert(2, 1);
    expect(getText(fixture)).equal('1one2two4four3three');
    // Move items
    move(data.items, 1, 0, 3);
    binding.move(1, 0, 3);
    expect(getText(fixture)).equal('2two4four3three1one');
    // Remove an item
    data.items.splice(2, 1);
    binding.remove(2, 1);
    expect(getText(fixture)).equal('2two4four1one');
  });

  // TODO: Should Saddle take care of these edge cases, or should the containing
  // framework be smart enough to call binding.update() in these cases instead
  // of binding.insert() / binding.remove()?
  it('inserts into an empty list with an else');
  it('removes all items from a list with an else');

});

function getContext(data, bindings) {
  var contextMeta = {
    addBinding: function(binding) {
      bindings && bindings.push(binding);
    }
  , removeBinding: function() {}
  };
  return new expressions.Context(contextMeta, data);
}

// IE <=8 return comments for Node.children
function getChildren(node) {
  var nodeChildren = node.children;
  var children = [];
  for (var i = 0, len = nodeChildren.length; i < len; i++) {
    var child = nodeChildren[i];
    if (child.nodeType === 1) children.push(child);
  }
  return children;
}

function getText(node) {
  // IE only supports innerText, and it sometimes returns extra whitespace
  return (node.textContent || node.innerText).replace(/\s/g, '');
}

function move(array, from, to, howMany) {
  var values = array.splice(from, howMany);
  array.splice.apply(array, [to, 0].concat(values))
}
