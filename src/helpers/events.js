export function sortEventByDateFn(
  { date: dateA, startTime: stA },
  { date: dateB, startTime: stB },
) {
  if (dateA < dateB) {
    return -1;
  }
  if (dateA > dateB) {
    return 1;
  }

  if (stA < stB) {
    return -1;
  }
  if (stA > stB) {
    return 1;
  }

  return 0;
}

export function makeSummary(data, customers) {
  const { customerId, groupId } = data;
  const cust = customers.find((c) => c.id === customerId);
  const grp = cust.groups.find((g) => g.id === groupId);
  return `${cust.name} - ${grp.name} - ${data.name}`;
}

function makeMarkdownGroup(customer, group, events) {
  const groupEvents = events.filter(
    (e) => e.customerId === customer.id && e.groupId === group.id,
  );
  const mdGroupEvents =
    groupEvents.length === 0
      ? '_No events yet_'
      : groupEvents
          .sort(sortEventByDateFn)
          .reduce(
            (carry, e) => [...carry, `* ${e.date} ${e.startTime} ${e.name}`],
            [],
          )
          .join('\n');

  return `### ${group.name}\n\n${mdGroupEvents}\n\n`;
}

function makeMarkdownCust(customer, events) {
  const markdownCust = customer.groups.reduce(
    (carry, g) => carry + makeMarkdownGroup(customer, g, events),
    `## ${customer.name}\n\n`,
  );
  return `${markdownCust}\n\n`;
}

export function makeMarkdown(customers, events) {
  return customers.reduce(
    (carry, c) => carry + makeMarkdownCust(c, events),
    '# Calendar\n\n',
  );
}
