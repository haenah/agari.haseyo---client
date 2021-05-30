import $ from 'jquery';

export function getFormValues<T extends { [k: string]: any } = { [k: string]: any }>(
  elem: HTMLFormElement
) {
  return Object.fromEntries(
    $(elem)
      .serializeArray()
      .map(({ name, value }) => [name, value])
  ) as T;
}
